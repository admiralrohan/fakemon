import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Gyms } from "./containers/Gyms";
import { Header } from "./components/Header";
import { Gym } from "./containers/Gym";
import { Profile } from "./containers/Profile";
import { Battle } from "./containers/Battle";
import { getBlockchain } from "./utils/utils";
import { ethers } from "ethers";
import { Toastr } from "./components/Toast";

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
  const [gyms, setGyms] = useState([]);

  // To trigger toast showing for 2s
  const [toastCount, setToastCount] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  // Login wallet address should match signer address
  const loginAddress = window.localStorage.getItem("loginAddress");
  const isBcDefined = blockchain.signerAddress;

  const showToastMessage = (message) => {
    setToastMessage(message);
    setToastCount((curr) => curr + 1);
  };

  const fetchTokenBalance = async () => {
    if (!isBcDefined) return;

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
      const tx = await blockchain.fakemon.registerUser();
      await tx.wait();
      setIsRegistered(true);

      await fetchTokenBalance();
      await fetchFakemonsByUser();
    } catch (error) {
      // TODO: Show error as toast
      console.error(error.error.data.message);
    }
  };

  // TODO: Simplify this logic
  const fetchFakemonsByUser = async () => {
    if (!isBcDefined) return;

    try {
      const [ids, stats] = await blockchain.fakemon.getAllCharactersByUser(
        blockchain.signerAddress
      );

      const noOfFakemons = ids.length;
      const processedList = [];
      for (let i = 0; i < noOfFakemons; i++) {
        processedList.push({
          id: ids[i].toString(),
          hp: stats[i].hp.toString(),
          attack: stats[i].attack.toString(),
          defense: stats[i].defense.toString(),
          gymId: stats[i].gymId.toString(),
          owner: stats[i].owner,
        });
      }

      console.log("Fakemons:", processedList);
      setFakemons(processedList);
    } catch (error) {
      // TODO: Show error as toast
      console.error(error.error.data.message);
    }
  };

  const fetchGyms = async () => {
    if (!isBcDefined) return;

    try {
      const rawGymList = await blockchain.fakemon.getAllGyms();

      const processedList = [];
      for (let i = 0; i < rawGymList.length; i++) {
        processedList.push({
          id: rawGymList[i].id.toString(),
          charIds: rawGymList[i].charIds.map((charId) => charId.toString()),
          isOpen: rawGymList[i].isOpen.toString(),
          owner: rawGymList[i].owner,
        });
      }

      console.log("Gyms:", processedList);
      setGyms(processedList);
    } catch (error) {
      // TODO: Show error as toast
      console.error(error.error.data.message);
    }
  };

  const fetchFakemonsByGym = async (gymId) => {
    if (!isBcDefined) return null;

    try {
      const [ids, stats] = await blockchain.fakemon.getAllCharactersByGym(
        gymId
      );

      const noOfFakemons = ids.length;
      const processedList = [];
      for (let i = 0; i < noOfFakemons; i++) {
        processedList.push({
          id: ids[i].toString(),
          hp: stats[i].hp.toString(),
          attack: stats[i].attack.toString(),
          defense: stats[i].defense.toString(),
          gymId: stats[i].gymId.toString(),
          owner: stats[i].owner,
        });
      }

      return processedList;
    } catch (error) {
      // TODO: Show error as toast
      console.error(error.error.data.message);
      return null;
    }
  };

  const getToken = () => {
    // TODO: Implement
    showToastMessage("Coming soon");
  };

  const mintFakemon = async () => {
    if (!isBcDefined) return;

    try {
      let tx = await blockchain.token.approve(
        blockchain.fakemon.address,
        NFT_FEE
      );
      await tx.wait();

      tx = await blockchain.fakemon.mintNewNFT();
      await tx.wait();

      await fetchTokenBalance();
      await fetchFakemonsByUser();

      showToastMessage("New fakemon minted");
    } catch (error) {
      // TODO: Show error as toast
      console.error(error.error.data.message);
    }
  };

  const createGym = async (selectedIds) => {
    if (!isBcDefined) return;

    try {
      const tx = await blockchain.fakemon.createNewGym(selectedIds);
      await tx.wait();

      await fetchTokenBalance();
      await fetchFakemonsByUser();
      await fetchGyms();

      showToastMessage("New gym created");
    } catch (error) {
      // TODO: Show error as toast
      console.error(error.error.data.message);
    }
  };

  // Connect our app with blockchain
  const connectWallet = async () => {
    if (blockchain.signerAddress) return;

    const bcDetails = await getBlockchain();
    setBlockchain(bcDetails);
    window.localStorage.setItem("loginAddress", bcDetails.signerAddress);
  };

  // It doesn't disconnect wallet with metamask
  // User has to do it manually
  // This process here is to just forbid our app to connect with blockchain automatically
  const detachWallet = () => {
    // TODO: Fix bug, sometimes user needs to click twice on the button to see effect
    window.localStorage.removeItem("loginAddress");
    setBlockchain(DEFAULT_BLOCKCHAIN_OBJ);

    showToastMessage("Wallet detached");
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
        await fetchFakemonsByUser();
        await fetchGyms();
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

        <Route
          path="/profile"
          element={
            <Profile
              userAddress={blockchain.signerAddress}
              isRegistered={isRegistered}
              registerUserHandler={registerUser}
              tokenBalance={tokenBalance}
              mintFakemonHandler={mintFakemon}
              getTokenHandler={getToken}
              fakemons={fakemons}
            />
          }
        />

        <Route
          path="/gyms"
          element={
            <Gyms
              userAddress={blockchain.signerAddress}
              gyms={gyms}
              fakemons={fakemons}
              createGym={createGym}
              isRegistered={isRegistered}
            />
          }
        />
        <Route
          path="/gyms/:id"
          element={
            <Gym
              userAddress={blockchain.signerAddress}
              fetchFakemonsByGym={fetchFakemonsByGym}
              gyms={gyms}
            />
          }
        />
        <Route
          path="/gyms/:id/battle"
          element={
            <Battle
              userAddress={blockchain.signerAddress}
              fakemonsInUserSquad={fakemons}
              gyms={gyms}
              fetchFakemonsByGym={fetchFakemonsByGym}
            />
          }
        />
      </Routes>

      <Toastr message={toastMessage} toastCount={toastCount} />
    </>
  );
}

export default App;
