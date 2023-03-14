import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../utils/utils";
import useBlockchain from "./useBlockchain";
import useIsRegistered from "./useIsRegistered";

function useCurrentBattle() {
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
        return {};
      }
    },
    { enabled: !!blockchain && isRegistered, placeholderData: {} }
  );
}

export default useCurrentBattle;
