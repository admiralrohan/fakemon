import { useCallback, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Gyms } from "./containers/Gyms";
import { Header } from "./components/Header";
import { Gym } from "./containers/Gym";
import { Profile } from "./containers/Profile";
import { Battle } from "./containers/Battle";
import { getBlockchain } from "./utils/utils";

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

  // Login wallet address should match signer address
  const loginAddress = !!window.localStorage.getItem("loginAddress");
  const isBcDefined = blockchain.signerAddress;

  const fetchTokenBalance = useCallback(async () => {
    if (!isBcDefined) return;

    window.localStorage.setItem("loginAddress", blockchain.signerAddress);

    try {
      // With decimals
      const fullBalance = await blockchain.token.balanceOf(
        blockchain.signerAddress
      );
      const tokenName = await blockchain.token.name();
      const decimals = await blockchain.token.decimals();

      // 50000000000000000000 Tokens -> 50 FMON
      const balance = fullBalance / 10 ** decimals;

      setTokenBalance(`${balance} ${tokenName}`);
    } catch (error) {
      // TODO: Show error as toast
      console.error(error);
    }
  }, [blockchain.signerAddress, blockchain.token, isBcDefined]);

  const checkIfUserRegistered = useCallback(async () => {
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
  }, [blockchain.fakemon, blockchain.signerAddress, isBcDefined]);

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

  // Fetch and set token balance
  useEffect(() => {
    (async function () {
      await fetchTokenBalance();
    })();
  }, [fetchTokenBalance]);

  // To connect on page refresh
  useEffect(() => {
    (async () => {
      if (loginAddress) {
        // TODO: Auto logout for account change in metamask
        // TODO: Handle chain id change
        setBlockchain(await getBlockchain());
        checkIfUserRegistered();
      }
    })();
  }, [checkIfUserRegistered, loginAddress]);

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
        <Route path="/gyms" element={<Gyms blockchain={blockchain} />} />
        <Route path="/gyms/:id" element={<Gym blockchain={blockchain} />} />
        <Route
          path="/gyms/:id/battle"
          element={<Battle blockchain={blockchain} />}
        />
        <Route
          path="/profile"
          element={
            <Profile
              blockchain={blockchain}
              isRegistered={isRegistered}
              registerUser={registerUser}
              tokenBalance={tokenBalance}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
