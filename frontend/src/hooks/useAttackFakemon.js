import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBattleView } from "../utils/utils";
import useBlockchain from "./useBlockchain";

function useAttackFakemon() {
  const { data: blockchain } = useBlockchain();
  const queryClient = useQueryClient();

  return useMutation(
    async (attackerId) => {
      const tx = await blockchain.fakemon.attack(attackerId);
      await tx.wait();
    },
    {
      onSuccess: () => {
        updateBattleView(queryClient);
      },
    }
  );
}

export default useAttackFakemon;
