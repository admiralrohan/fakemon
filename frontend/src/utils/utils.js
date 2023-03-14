import { ethers } from "ethers";

/**
 * Use case: \
 * Token name and decimals won't change after contract deployment, so only 1 time fetch \
 * I can use react state and context for this, but it will be called everytime I fetch `tokenBalance`
 */
export const oneTimeQueryFetchOptions = {
  refetchInterval: false,
  staleTime: Infinity,
  cacheTime: Infinity,
  retry: 3, // If some temp problem happens in node provider like Alchemy, Infura, Quicknode
};

export const DEFAULT_BLOCKCHAIN_OBJ = {
  signerAddress: undefined,
  token: undefined,
  fakemon: undefined,
};

export const LOCALSTORAGE_KEY = "walletAddress";
export const QueryKeys = {
  BLOCKCHAIN: "blockchain",
  TOKEN_NAME: "tokenName",
  TOKEN_DECIMALS: "tokenDecimals",
  TOKEN_BALANCE: "tokenBalance",
  IS_REGISTERED: "isRegistered",
  CURRENT_BATTLE: "currentBattle",
  FAKEMONS: "fakemons",
  GYMS: "gyms",
  FAKEMONS_IN_GYM: "gym",
};

const chainIds = {
  goerli: 5,
  hardhat: 31337,
};

export const getBlockchain = () => {
  return new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      const targetNetwork = process.env.REACT_APP_NETWORK
        ? process.env.REACT_APP_NETWORK
        : "hardhat";
      const TokenContract = await import(
        `../artifacts/contracts/${targetNetwork}/fmon.json`
      );
      const FakemonContract = await import(
        `../artifacts/contracts/${targetNetwork}/fakemon.json`
      );

      const { chainId: userNetworkChainId } = await provider.getNetwork();

      if (chainIds[targetNetwork] !== userNetworkChainId) {
        reject(`Change your network to ${targetNetwork}`);
      }

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

    resolve(DEFAULT_BLOCKCHAIN_OBJ);
  });
};

export const showError = (error) => {
  // Convert "Error: VM Exception while processing transaction: reverted with reason string 'Battle expired'" into "Battle expired"
  const errorMessage = error.error
    ? error.error.data.message
        .split(
          "Error: VM Exception while processing transaction: reverted with reason string "
        )[1]
        .split("'")[1]
    : error.message;

  console.error(errorMessage);

  return errorMessage;
};

// TODO: Open a gym, then go to different battle page via URL
export const updateBattleView = async (queryClient) => {
  // await getCurrentBattleDetails();
  // await fetchFakemonsByUser();
  // await fetchFakemonsByGym(currentBattle.gymId);

  queryClient.invalidateQueries([QueryKeys.CURRENT_BATTLE]);
  queryClient.invalidateQueries([QueryKeys.FAKEMONS]);
  //  TODO: How to pass on gymId?
  queryClient.invalidateQueries([QueryKeys.FAKEMONS_IN_GYM]);
};
