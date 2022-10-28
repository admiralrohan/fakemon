import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/auth-context";

export function useTokenBalance(blockchain, isBcDefined) {
  // const value = useAuth();
  // console.log(value);

  const result = useQuery(["tokenBalance", isBcDefined], async (ctx) => {
    if (!isBcDefined) return Promise.resolve("Loading...");

    try {
      // With decimals
      const fullBalance = await blockchain.token.balanceOf(
        blockchain.signerAddress
      );
      // TODO: Cache tokenName and decimals, as they won't change very often
      const tokenName = await blockchain.token.name();
      const decimals = await blockchain.token.decimals();

      // 50*(10**18) Tokens -> 50 FMON
      const balance = fullBalance / 10 ** decimals;

      return `${balance} ${tokenName}`;
    } catch (error) {
      return Promise.reject(error.message);
    }
  });

  return result;
}
