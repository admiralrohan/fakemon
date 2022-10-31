import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { QueryKeys } from "./data.service";
import { useBlockchain } from "./utils";

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
  const NFT_FEE = ethers.utils.parseEther("5");

  return useMutation(
    async () => {
      // setIndividualShowLoader({ mintFakemon: true });
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
        // TODO: Show toast
      },
    }
  );
}

export function useCreateGym() {
  const { data: blockchain } = useBlockchain();
  const queryClient = useQueryClient();

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
      },
    }
  );
}

export function useConnectWallet() {}
