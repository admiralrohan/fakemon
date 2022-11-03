import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useAuth } from "../context/auth-context";
import { LOCALSTORAGE_KEY, QueryKeys } from "./data.service";

export const CardText = styled.p`
  margin-bottom: 0;
`;

export const DEFAULT_BLOCKCHAIN_OBJ = {
  signerAddress: undefined,
  token: undefined,
  fakemon: undefined,
};

export const getBlockchain = () => {
  return new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      const network = process.env.REACT_APP_NETWORK
        ? process.env.REACT_APP_NETWORK
        : "hardhat";
      const TokenContract = await import(
        `../artifacts/contracts/${network}/fmon.json`
      );
      const FakemonContract = await import(
        `../artifacts/contracts/${network}/fakemon.json`
      );

      const token = new ethers.Contract(
        TokenContract.address,
        TokenContract.abi,
        signer
      );
      const fakemon = new ethers.Contract(
        FakemonContract.address,
        FakemonContract.abi,
        signer
      );

      // TODO: Calling thrice - 1 is due to React strict mode
      // console.log("getBlockchain call");
      resolve({ signerAddress, token, fakemon });
    }

    resolve(DEFAULT_BLOCKCHAIN_OBJ);
  });
};

export function useBlockchain() {
  const [walletConnected] = useAuth();

  return useQuery([QueryKeys.BLOCKCHAIN], getBlockchain, {
    enabled: walletConnected,
    placeholderData: DEFAULT_BLOCKCHAIN_OBJ,
    onSuccess: (data) => {
      // queryClient.setQueryData([QueryKeys.SIGNER_ADDRESS], data.signerAddress);
      window.localStorage.setItem(LOCALSTORAGE_KEY, data.signerAddress);
    },
  });
}

// export function useSignerAddress() {
//   const { data: blockchain } = useBlockchain();

//   return useQuery([QueryKeys.SIGNER_ADDRESS], () => blockchain.signerAddress, {onSuccess: (data) => {
//     window.localStorage.setItem("loginAddress", data.signerAddress);

//   }});
// }
