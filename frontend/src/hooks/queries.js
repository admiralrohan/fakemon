import { useQuery } from "@tanstack/react-query";
import { oneTimeQueryFetchOptions, QueryKeys } from "../utils/utils";
import useBlockchain from "./useBlockchain";

export function useTokenName() {
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

export function useTokenDecimals() {
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

export function useTokenBalance() {
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

export function useIsRegistered() {
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

export function useFakemonsByUser() {
  const { data: blockchain } = useBlockchain();

  return useQuery(
    [QueryKeys.FAKEMONS],
    async () => {
      try {
        const [ids, stats] = await blockchain.fakemon.getAllCharactersByUser(
          blockchain.signerAddress
        );

        const noOfFakemons = ids.length;
        const processedList = [];
        for (let i = 0; i < noOfFakemons; i++) {
          processedList.push({
            id: ids[i].toString(),
            hp: stats[i].hp.toString(),
            attack: stats[i].attack.toString(),
            defense: stats[i].defense.toString(),
            gymId: stats[i].gymId.toString(),
            owner: stats[i].owner,
          });
        }

        return processedList;
      } catch (error) {
        // showError(error);
        return [];
      }
    },
    { enabled: !!blockchain, placeholderData: [] }
  );
}
