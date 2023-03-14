import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QueryKeys } from "../utils/utils";
import useBlockchain from "./useBlockchain";

// TODO: Open a gym, then go to different battle page via URL
const updateBattleView = async (queryClient) => {
  // await getCurrentBattleDetails();
  // await fetchFakemonsByUser();
  // await fetchFakemonsByGym(currentBattle.gymId);

  queryClient.invalidateQueries([QueryKeys.CURRENT_BATTLE]);
  queryClient.invalidateQueries([QueryKeys.FAKEMONS]);
  //  TODO: How to pass on gymId?
  queryClient.invalidateQueries([QueryKeys.FAKEMONS_IN_GYM]);
};

export function useFleeBattle() {
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

export function useEndBattle() {
  const { data: blockchain } = useBlockchain();
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const tx = await blockchain.fakemon.endBattle();
      await tx.wait();
    },
    {
      onSuccess: () => {
        updateBattleView(queryClient);
      },
    }
  );
}

export function useAttackFakemon() {
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
