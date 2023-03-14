import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../utils/utils";
import useBlockchain from "./useBlockchain";
import useTokenDecimals from "./useTokenDecimals";
import useTokenName from "./useTokenName";

function useTokenBalance() {
  const { data: blockchain } = useBlockchain();
  const { data: tokenName, isSuccess: isTokenNameFetched } = useTokenName();
  const { data: decimals, isSuccess: isDecimalsFetched } = useTokenDecimals();

  return useQuery(
    [QueryKeys.TOKEN_BALANCE],
    async () => {
      try {
        // With decimals
        const fullBalance = await blockchain.token.balanceOf(
          blockchain.signerAddress
        );

        // 50*(10**18) Tokens -> 50 FMON
        const balance = fullBalance / 10 ** decimals;

        return `${balance} ${tokenName}`;
      } catch (error) {
        return "Loading...";
      }
    },
    {
      enabled: !!blockchain && isTokenNameFetched && isDecimalsFetched,
      placeholderData: "Loading...",
    }
  );
}

export default useTokenBalance;
