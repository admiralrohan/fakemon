import { useQuery } from "@tanstack/react-query";
import { oneTimeQueryFetchOptions, useBlockchain } from "./utils";

export const LOCALSTORAGE_KEY = "walletAddress";
export const QueryKeys = {
  BLOCKCHAIN: "blockchain",
  TOKEN_NAME: "tokenName",
  TOKEN_DECIMALS: "tokenDecimals",
  TOKEN_BALANCE: "tokenBalance",
  IS_REGISTERED: "isRegistered",
  CURRENT_BATTLE: "currentBattle",
  FAKEMONS: "fakemons",
  GYMS: "gyms",
  FAKEMONS_IN_GYM: "gym",
};

export function useTokenName() {
  const { data: blockchain } = useBlockchain();

  return useQuery(
    [QueryKeys.TOKEN_NAME],
    () => {
      try {
        return blockchain.token.name();
      } catch (error) {
        return Promise.reject(error.message);
      }
    },
    {
      enabled: !!blockchain.signerAddress,
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
        return Promise.reject(error.message);
      }
    },
    {
      enabled: !!blockchain.signerAddress,
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
        return Promise.reject(error.message);
      }
    },
    {
      enabled:
        !!blockchain.signerAddress && isTokenNameFetched && isDecimalsFetched,
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
        return Promise.reject(error.message);
      }
    },
    { enabled: !!blockchain.signerAddress, placeholderData: false }
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

        // console.log("Fakemons:", processedList);
        return processedList;
      } catch (error) {
        console.error("Error", error.message);
        // showError(error);
        return [];
      }
    },
    { enabled: !!blockchain.signerAddress, placeholderData: [] }
  );
}

export function useFakemonsByGym(gymId) {
  const { data: blockchain } = useBlockchain();
  const placeholderData = { id: "0", fakemons: [] };

  return useQuery(
    [QueryKeys.FAKEMONS_IN_GYM, gymId],
    async ({ queryKey: [, gymId] }) => {
      try {
        const [ids, stats] = await blockchain.fakemon.getAllCharactersByGym(
          gymId
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

        return Promise.resolve({ id: gymId, fakemons: processedList });
      } catch (error) {
        // showError(error);
        return Promise.resolve(placeholderData);
      }
    },
    { enabled: !!blockchain.signerAddress, placeholderData }
  );
}

export function useGyms() {
  const { data: blockchain } = useBlockchain();

  return useQuery(
    [QueryKeys.GYMS],
    async () => {
      try {
        const rawGymList = await blockchain.fakemon.getAllGyms();

        const processedList = [];
        for (let i = 0; i < rawGymList.length; i++) {
          processedList.push({
            id: rawGymList[i].id.toString(),
            charIds: rawGymList[i].charIds.map((charId) => charId.toString()),
            isOpen: rawGymList[i].isOpen.toString(),
            owner: rawGymList[i].owner,
          });
        }

        // console.log("Gyms:", processedList);
        return processedList;
      } catch (error) {
        console.error(error.message);
        // showError(error);
        return [];
      }
    },
    { enabled: !!blockchain.signerAddress, placeholderData: [] }
  );
}

export function useCurrentBattle() {
  const { data: blockchain } = useBlockchain();
  const { data: isRegistered } = useIsRegistered();

  return useQuery(
    [QueryKeys.CURRENT_BATTLE],
    async () => {
      try {
        const rawCurrentBattle =
          await blockchain.fakemon.getCurrentBattleDetails();

        return {
          id: rawCurrentBattle.id.toString(),
          gymId: rawCurrentBattle.gymId.toString(),
          expirationTime: new Date(rawCurrentBattle.expirationTime * 1000), // Converting sec to ms
          isEnded: rawCurrentBattle.isEnded,
          isWon: rawCurrentBattle.isWon,
        };
      } catch (error) {
        console.error(error.message);
        return {};
      }
    },
    { enabled: !!blockchain.signerAddress && isRegistered, placeholderData: {} }
  );
}
