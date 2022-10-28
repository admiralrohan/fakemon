import styled from "@emotion/styled";
import { ethers } from "ethers";

export const CardText = styled.p`
  margin-bottom: 0;
`;

export const getBlockchain = () =>
  new Promise(async (resolve, reject) => {
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

      resolve({ signerAddress, token, fakemon });
    }

    resolve({
      signerAddress: undefined,
      token: undefined,
      fakemon: undefined,
    });
  });
