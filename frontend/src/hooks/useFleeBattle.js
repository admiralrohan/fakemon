import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBattleView } from "../utils/utils";
import useBlockchain from "./useBlockchain";

function useFleeBattle() {
  const { data: blockchain } = useBlockchain();
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const tx = await blockchain.fakemon.fleeBattle();
      await tx.wait();
    },
    {
      onSuccess: () => {
        updateBattleView(queryClient);
      },
    }
  );
}

export default useFleeBattle;
