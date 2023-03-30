import styled from "@emotion/styled";
import React from "react";
import useAuth from "../../hooks/useAuth";
import useCreateGym from "../../hooks/useCreateGym";
import useFakemonsByUser from "../../hooks/useFakemonsByUser";
import useGyms from "../../hooks/useGyms";
import useIsRegistered from "../../hooks/useIsRegistered";
import Alert from "../Alert";
import ButtonWithLoader from "../ButtonWithLoader";
import CreateGymModal from "../CreateGymModal";
import ImportWalletAlert from "../ImportWalletAlert";
import Modal from "../Modal";
import GymList from "./GymList";

function Gyms() {
  const [showModal, setShowModal] = React.useState(false);

  const { walletAddress } = useAuth();
  const { data: isRegistered } = useIsRegistered();
  const { data: fakemons } = useFakemonsByUser();
  const { data: gyms } = useGyms();

  const { mutate: createGym, isLoading: isCreateGymLoading } = useCreateGym();

  if (!walletAddress) return <ImportWalletAlert />;

  return (
    <Wrapper>
      <GymsTitle>Gyms</GymsTitle>
      <Modal fakemons={fakemons} dismiss />

      <CreateGymButton
        showLoader={isCreateGymLoading}
        size="sm"
        disabled={!isRegistered || fakemons.length === 0}
        title={
          !isRegistered
            ? "You need to register first"
            : fakemons.length === 0
            ? "You need some fakemons"
            : null
        }
        onClick={() => setShowModal(true)}
      >
        Create gym
      </CreateGymButton>

      {isRegistered && (
        <CreateGymModal
          show={showModal}
          dismiss={() => setShowModal(false)}
          close={(selectedIds) => {
            setShowModal(false);
            createGym(selectedIds);
          }}
          fakemons={fakemons}
        />
      )}

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

const CreateGymButton = styled(ButtonWithLoader)`
  align-self: flex-end;
`;

export default Gyms;
