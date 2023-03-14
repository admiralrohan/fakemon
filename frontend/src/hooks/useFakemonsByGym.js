import useBlockchain from "./useBlockchain";
const { useQuery } = require("@tanstack/react-query");
const { QueryKeys } = require("../utils/utils");

function useFakemonsByGym(gymId) {
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

        return { id: gymId, fakemons: processedList };
      } catch (error) {
        // showError(error);
        return placeholderData;
      }
    },
    { enabled: !!blockchain, placeholderData }
  );
}

export default useFakemonsByGym;
