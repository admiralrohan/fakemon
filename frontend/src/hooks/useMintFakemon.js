import { ethers } from "ethers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useBlockchain from "./useBlockchain";
import useToast from "./useToast";
import { QueryKeys } from "../utils/utils";

function useMintFakemon() {
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

export default useMintFakemon;
