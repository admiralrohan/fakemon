import { useMutation } from "@tanstack/react-query";
import useAuth from "./useAuth";

/**
 * Connect our app with blockchain
 */
function useConnectWallet() {
  const { setWalletConnected, handleAccountsChanged, handleChainChanged } =
    useAuth();

  return useMutation(
    () => {
      setWalletConnected(true);
    },
    {
      onSuccess: () => {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
      },
    }
  );
}

export default useConnectWallet;
