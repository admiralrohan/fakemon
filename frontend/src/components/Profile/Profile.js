import React from "react";

import ImportWalletAlert from "../ImportWalletAlert";

import useAuth from "../../hooks/useAuth";
import Stats from "./Stats";
import UserSquad from "./UserSquad";
import styled from "@emotion/styled";

function Profile() {
  const { walletAddress } = useAuth();

  if (!walletAddress) return <ImportWalletAlert />;

  return (
    <Wrapper>
      <Stats />
      <UserSquad />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default Profile;
