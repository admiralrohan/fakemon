import { useCallback, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Gyms } from "./containers/Gyms";
import { Header } from "./components/Header";
import { Gym } from "./containers/Gym";
import { Profile } from "./containers/Profile";
import { Battle } from "./containers/Battle";
import { getBlockchain } from "./utils/utils";
import { ethers } from "ethers";

const NFT_FEE = ethers.utils.parseEther("5");
const DEFAULT_BLOCKCHAIN_OBJ = {
  signerAddress: undefined,
  token: undefined,
  fakemon: undefined,
};

function App() {
  const [blockchain, setBlockchain] = useState(DEFAULT_BLOCKCHAIN_OBJ);
  // eg. "5 FMON" in string format
  const [tokenBalance, setTokenBalance] = useState("Loading...");
  const [isRegistered, setIsRegistered] = useState(false);
  const [fakemons, setFakemons] = useState([]);

  // Login wallet address should match signer address
  const loginAddress = window.localStorage.getItem("loginAddress");
  const isBcDefined = blockchain.signerAddress;

  const fetchTokenBalance = async () => {
    if (!isBcDefined) return;

    window.localStorage.setItem("loginAddress", blockchain.signerAddress);

    try {
      // With decimals
      const fullBalance = await blockchain.token.balanceOf(
        blockchain.signerAddress
      );
      // TODO: Cache tokenName and decimals, as they won't change very often
      const tokenName = await blockchain.token.name();
      const decimals = await blockchain.token.decimals();

      // 50000000000000000000 Tokens -> 50 FMON
      const balance = fullBalance / 10 ** decimals;

      setTokenBalance(`${balance} ${tokenName}`);
    } catch (error) {
      // TODO: Show error as toast
      console.error(error);
      setTokenBalance("Error fetching");
    }
  };

  const checkIfUserRegistered = async () => {
    if (!isBcDefined) return;

    try {
      const isRegistered = await blockchain.fakemon.users(
        blockchain.signerAddress
      );
      setIsRegistered(isRegistered);
    } catch (error) {
      // TODO: Show error as toast
      console.error(error);
      setIsRegistered(false);
    }
  };

  const registerUser = async () => {
    if (!isBcDefined) return;

    try {
      await blockchain.fakemon.registerUser();
      setIsRegistered(true);
    } catch (error) {
      // TODO: Show error as toast
      console.error(error.error.data.message);
    }
  };

  const fetchFakemons = async () => {
    if (!isBcDefined) return;

    try {
      const stats = await blockchain.fakemon.getAllCharacters(
        blockchain.signerAddress
      );
      console.log(stats);
    } catch (error) {
      // TODO: Show error as toast
      console.error(error.error.data.message);
    }
  };

  const getToken = () => {
    // TODO: Implement
    console.log("Coming soon");
  };

  const mintFakemon = async () => {
    if (!isBcDefined) return;

    try {
      let tx = await blockchain.token.approve(
        blockchain.fakemon.address,
        NFT_FEE
      );
      await tx.wait();

      tx = await blockchain.fakemon.mintNewNFT({
        value: NFT_FEE,
      });
      await tx.wait();

      await fetchTokenBalance();
      await fetchFakemons();
    } catch (error) {
      // TODO: Show error as toast
      console.error(error.error.data.message);
    }
  };

  // Connect our app with blockchain
  const connectWallet = async () => {
    if (blockchain.signerAddress) return;

    setBlockchain(await getBlockchain());
  };

  // It doesn't disconnect wallet with metamask
  // User has to do it manually
  // This process here is to just forbid our app to connect with blockchain automatically
  const detachWallet = () => {
    // TODO: Fix bug, sometimes user needs to click twice on the button to see effect
    window.localStorage.removeItem("loginAddress");
    setBlockchain(DEFAULT_BLOCKCHAIN_OBJ);
  };

  // Fetch initial data if already logged in
  useEffect(() => {
    (async () => {
      if (loginAddress) {
        // TODO: Auto logout for account change in metamask
        // TODO: Handle chain id change
        setBlockchain(await getBlockchain());
        await checkIfUserRegistered();
        await fetchTokenBalance();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginAddress, blockchain.signerAddress]);

  // Fetch these details if user already registered
  useEffect(() => {
    (async () => {
      if (isRegistered) {
        await fetchFakemons();
        // TODO: Fetch gyms
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRegistered]);

  return (
    <>
      <Header
        walletAddress={blockchain.signerAddress}
        tokenBalance={tokenBalance}
        connectWalletHandler={connectWallet}
        detachWalletHandler={detachWallet}
      />

      <Routes>
        <Route path="/" element={<Navigate replace to="/profile" />} />
        <Route path="/gyms" element={<Gyms />} />
        <Route path="/gyms/:id" element={<Gym />} />
        <Route path="/gyms/:id/battle" element={<Battle />} />
        <Route
          path="/profile"
          element={
            <Profile
              userAddress={loginAddress}
              isRegistered={isRegistered}
              registerUserHandler={registerUser}
              tokenBalance={tokenBalance}
              mintFakemonHandler={mintFakemon}
              getTokenHandler={getToken}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
