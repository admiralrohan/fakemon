import React from "react";

import ImportWalletAlert from "../ImportWalletAlert";

import useAuth from "../../hooks/useAuth";
import Stats from "./Stats";
import UserSquad from "./UserSquad";

function Profile() {
  const { walletAddress } = useAuth();

  if (!walletAddress) return <ImportWalletAlert />;

  return (
    <>
      <Stats />
      <UserSquad />
    </>
  );
}

export default Profile;
