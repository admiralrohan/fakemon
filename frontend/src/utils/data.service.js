import { useQuery } from "@tanstack/react-query";
import { useBlockchain } from "./utils";

export const LOCALSTORAGE_KEY = "walletAddress";
export const QueryKeys = {
  BLOCKCHAIN: "blockchain",
  TOKEN_NAME: "tokenName",
  TOKEN_BALANCE: "tokenBalance",
  IS_REGISTERED: "isRegistered",
  CURRENT_BATTLE: "currentBattle",
  FAKEMONS: "fakemons",
  GYMS: "gyms",
  FAKEMONS_IN_GYM: "fakemonsInGym",
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
    { enabled: !!blockchain.signerAddress, initialData: "Loading..." }
  );
}

// TODO: Refresh it frequently, as someone can send this user these tokens directly from metamask.
export function useTokenBalance() {
  const { data: blockchain } = useBlockchain();

  return useQuery(
    [QueryKeys.TOKEN_BALANCE],
    async () => {
      try {
        // With decimals
        const fullBalance = await blockchain.token.balanceOf(
          blockchain.signerAddress
        );
        // TODO: Cache tokenName and decimals, as they won't change very often
        const tokenName = await blockchain.token.name();
        // const tokenName = queryClient.getQueryData(["tokenName"]);
        // console.log(tokenName);
        const decimals = await blockchain.token.decimals();

        // 50*(10**18) Tokens -> 50 FMON
        const balance = fullBalance / 10 ** decimals;
        // console.log(balance);

        return `${balance} ${tokenName}`;
      } catch (error) {
        return Promise.reject(error.message);
      }
    },
    { enabled: !!blockchain.signerAddress, initialData: "Loading..." }
  );
}

export function useIsRegistered() {
  const { data: blockchain } = useBlockchain();

  return useQuery(
    [QueryKeys.IS_REGISTERED],
    () => {
      try {
        // console.log("Is registered", blockchain.signerAddress);
        return blockchain.fakemon.users(blockchain.signerAddress);
        // return Promise.resolve(false);
      } catch (error) {
        return Promise.reject(error.message);
      }
    },
    { enabled: !!blockchain.signerAddress, initialData: false }
  );
}

export function useFakemonsByUser() {
  const { data: blockchain } = useBlockchain();
  // console.log(!!blockchain.signerAddress);

  return useQuery(
    [QueryKeys.FAKEMONS],
    async () => {
      try {
        // if (!blockchain.fakemon) return [];
        console.log("useFakemonsByUser", blockchain.signerAddress);
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
    { enabled: !!blockchain.signerAddress, initialData: [] }
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
        // console.log("Inside gym", blockchain.signerAddress);
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
    { enabled: !!blockchain.signerAddress, initialData: [] }
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
    { enabled: !!blockchain.signerAddress && isRegistered, initialData: {} }
  );
}
