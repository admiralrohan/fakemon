import { useQuery } from "@tanstack/react-query";
import { oneTimeQueryFetchOptions, QueryKeys } from "../utils/utils";
import useBlockchain from "./useBlockchain";

function useTokenName() {
  const { data: blockchain } = useBlockchain();

  return useQuery(
    [QueryKeys.TOKEN_NAME],
    () => {
      try {
        return blockchain.token.name();
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

export default useTokenName;
