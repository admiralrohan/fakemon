import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../utils/utils";
import useBlockchain from "./useBlockchain";

function useIsRegistered() {
  const { data: blockchain } = useBlockchain();

  return useQuery(
    [QueryKeys.IS_REGISTERED],
    () => {
      try {
        return blockchain.fakemon.users(blockchain.signerAddress);
      } catch (error) {
        return false;
      }
    },
    { enabled: !!blockchain, placeholderData: false }
  );
}

export default useIsRegistered;
