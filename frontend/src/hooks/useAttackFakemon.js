import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBattleView } from "../utils/utils";
import useBlockchain from "./useBlockchain";
import useToast from "./useToast";

function useAttackFakemon() {
  const { data: blockchain } = useBlockchain();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation(
    async (attackerId) => {
      try {
        const tx = await blockchain.fakemon.attack(attackerId);
        await tx.wait();
      } catch ({ error }) {
        const { code, message } = error.data;
        // "Error: VM Exception while processing transaction: reverted with reason string 'Battle expired'" -> "Battle expired"
        const errorMessage =
          code === -32603
            ? message.split("'")[1]
            : "Transaction failed, try again";

        showToast(errorMessage);
      }
    },
    {
      onSuccess: () => {
        updateBattleView(queryClient);
      },
    }
  );
}

export default useAttackFakemon;
