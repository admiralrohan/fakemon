import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../utils/utils";
import useBlockchain from "./useBlockchain";

function useFakemonsByUser() {
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

export default useFakemonsByUser;
