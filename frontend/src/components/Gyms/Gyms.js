import styled from "@emotion/styled";
import React from "react";
import useAuth from "../../hooks/useAuth";
import useGyms from "../../hooks/useGyms";
import Alert from "../Alert";
import CreateGymModal from "../CreateGymModal";
import ImportWalletAlert from "../ImportWalletAlert";
import GymList from "./GymList";

function Gyms() {
  const { walletAddress } = useAuth();

  const { data: gyms } = useGyms();

  if (!walletAddress) return <ImportWalletAlert />;

  return (
    <Wrapper>
      <GymsTitle>Gyms</GymsTitle>
      <CreateGymModal />
      {gyms.length === 0 ? <Alert>No gyms yet</Alert> : <GymList />}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const GymsTitle = styled.h1`
  font-size: 1.25rem;
  text-align: center;
  margin: 0;
`;

export default Gyms;
