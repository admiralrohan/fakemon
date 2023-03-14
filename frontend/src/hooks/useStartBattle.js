import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../utils/utils";
import useBlockchain from "./useBlockchain";

function useStartBattle() {
  const { data: blockchain } = useBlockchain();
  const queryClient = useQueryClient();

  return useMutation(
    async (gymId) => {
      const tx = await blockchain.fakemon.startBattle(gymId);
      await tx.wait();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.CURRENT_BATTLE]);
      },
    }
  );
}

export default useStartBattle;
