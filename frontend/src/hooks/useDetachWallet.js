import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LOCALSTORAGE_KEY, QueryKeys } from "../utils/utils";
import useAuth from "./useAuth";

/**
 * It doesn't disconnect wallet with metamask, user has to do it manually \
 * This process here is to just forbid our app to connect with blockchain automatically
 */
function useDetachWallet() {
  const queryClient = useQueryClient();
  const {
    setWalletConnected,
    setWalletAddress,
    handleAccountsChanged,
    handleChainChanged,
  } = useAuth();

  return useMutation(
    async () => {
      setWalletConnected(false);
      setWalletAddress(null);
      queryClient.removeQueries([QueryKeys.BLOCKCHAIN]);
      window.localStorage.removeItem(LOCALSTORAGE_KEY);
    },
    {
      onSuccess: () => {
        if (!window.ethereum) return;

        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      },
    }
  );
}

export default useDetachWallet;
