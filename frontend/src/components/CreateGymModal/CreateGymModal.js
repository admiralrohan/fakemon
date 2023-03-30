import styled from "@emotion/styled";
import React from "react";
import Button from "../Button";
import ButtonWithLoader from "../ButtonWithLoader";
import FakemonList from "../FakemonList";
import Modal from "../Modal";
import FakemonActions from "./FakemonActions";
import useFakemonsByUser from "../../hooks/useFakemonsByUser";
import useCreateGym from "../../hooks/useCreateGym";
import useIsRegistered from "../../hooks/useIsRegistered";

/**
 * Will show list of non-staked fakemons which can be chosen to create new gym.
 */
function CreateGymModal({ close }) {
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const { data: isRegistered } = useIsRegistered();
  const { data: fakemons } = useFakemonsByUser();
  const { mutate: createGym, isLoading: isCreateGymLoading } = useCreateGym();

  const nonStakedFakemons = fakemons.filter((fakemon) => fakemon.gymId === "0");
  const noOfStakedFakemons = fakemons.length - nonStakedFakemons.length;

  const createGymHandler = () => {
    setSelectedIds([]);
    setIsOpen(false);
    createGym(selectedIds);
  };

  return (
    <Modal
      title="Create new gym"
      trigger={
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
        >
          Create gym
        </CreateGymButton>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <FakemonList
        fakemons={nonStakedFakemons}
        actions={
          <FakemonActions
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        }
      />

      <Notice>
        {noOfStakedFakemons} fakemons are staked which can't be used
      </Notice>

      <Actions>
        <ButtonWithLoader
          variant="primary"
          title={
            selectedIds.length === 0 ? "Select fakemons to create gym" : null
          }
          onClick={createGymHandler}
          disabled={selectedIds.length === 0}
        >
          Create
        </ButtonWithLoader>

        <Button variant="secondary" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </Actions>
    </Modal>
  );
}

const Notice = styled.div`
  text-align: center;
`;
const Actions = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  flex-direction: row-reverse;
`;
const CreateGymButton = styled(Button)`
  align-self: flex-end;
`;

export default CreateGymModal;
