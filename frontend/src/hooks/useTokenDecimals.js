import { useQuery } from "@tanstack/react-query";
import { oneTimeQueryFetchOptions, QueryKeys } from "../utils/utils";
import useBlockchain from "./useBlockchain";

function useTokenDecimals() {
  const { data: blockchain } = useBlockchain();

  return useQuery(
    [QueryKeys.TOKEN_DECIMALS],
    () => {
      try {
        return blockchain.token.decimals();
      } catch (error) {
        // We want to throw error to trigger retry
        return Promise.reject(error.message);
      }
    },
    {
      enabled: !!blockchain,
      ...oneTimeQueryFetchOptions,
    }
  );
}

export default useTokenDecimals;
