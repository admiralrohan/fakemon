import { useQuery } from "@tanstack/react-query";
import { getBlockchain, LOCALSTORAGE_KEY, QueryKeys } from "../utils/utils";
import useAuth from "./useAuth";
import useToast from "./useToast";

function useBlockchain() {
  const { walletConnected, setWalletAddress } = useAuth();
  const { showToast } = useToast();

  return useQuery([QueryKeys.BLOCKCHAIN], getBlockchain, {
    enabled: walletConnected,
    placeholderData: null,
    onSuccess: (data) => {
      setWalletAddress(data.signerAddress);
      window.localStorage.setItem(LOCALSTORAGE_KEY, data.signerAddress);
    },
    onError: (error) => {
      showToast(error);
      window.localStorage.removeItem(LOCALSTORAGE_KEY);
    },
  });
}

export default useBlockchain;
