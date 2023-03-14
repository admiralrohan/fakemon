import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { QueryKeys } from "../utils/utils";
import useBlockchain from "./useBlockchain";
import useToast from "./useToast";

export function useRegister() {
  const { data: blockchain } = useBlockchain();
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const tx = await blockchain.fakemon.registerUser();
      await tx.wait();
      queryClient.setQueryData([QueryKeys.IS_REGISTERED], true);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.TOKEN_BALANCE]);
        queryClient.invalidateQueries([QueryKeys.FAKEMONS]);
      },
    }
  );
}

export function useMintFakemon() {
  const { data: blockchain } = useBlockchain();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const NFT_FEE = ethers.utils.parseEther("5");

  return useMutation(
    async () => {
      let tx = await blockchain.token.approve(
        blockchain.fakemon.address,
        NFT_FEE
      );
      await tx.wait();

      tx = await blockchain.fakemon.mintNewNFT();
      await tx.wait();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.TOKEN_BALANCE]);
        queryClient.invalidateQueries([QueryKeys.FAKEMONS]);
        showToast("New fakemon minted");
      },
    }
  );
}

export function useCreateGym() {
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

export function useStartBattle() {
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
