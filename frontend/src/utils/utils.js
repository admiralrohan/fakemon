import styled from "@emotion/styled";
import { ethers } from "ethers";
import TokenContract from "../artifacts/contracts/fmon.json";
import FakemonContract from "../artifacts/contracts/fakemon.json";

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
