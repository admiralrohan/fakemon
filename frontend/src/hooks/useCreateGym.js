import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../utils/utils";
import useBlockchain from "./useBlockchain";
import useToast from "./useToast";

function useCreateGym() {
  const { data: blockchain } = useBlockchain();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation(
    async (selectedIds) => {
      const tx = await blockchain.fakemon.createNewGym(selectedIds);
      await tx.wait();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.TOKEN_BALANCE]);
        queryClient.invalidateQueries([QueryKeys.FAKEMONS]);
        queryClient.invalidateQueries([QueryKeys.GYMS]);
        showToast("New gym created");
      },
    }
  );
}

export default useCreateGym;
