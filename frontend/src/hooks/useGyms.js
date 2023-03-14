import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../utils/utils";
import { useBlockchain } from "./queries";

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

        return processedList;
      } catch (error) {
        // showError(error);
        return [];
      }
    },
    { enabled: !!blockchain, placeholderData: [] }
  );
}
