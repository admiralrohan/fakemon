import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import FakemonList from "../FakemonList";
import FakemonActions from "../CreateGymModal/FakemonActions";
import Button from "../Button";
import styled from "@emotion/styled";
import ButtonWithLoader from "../ButtonWithLoader";

function Modal({ fakemons }) {
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const nonStakedFakemons = fakemons.filter((fakemon) => fakemon.gymId === "0");
  const noOfStakedFakemons = fakemons.length - nonStakedFakemons.length;

  return (
    <Wrapper open={isOpen} onOpenChange={setIsOpen}>
      <Button as={Dialog.Trigger}>Create gym</Button>
      <Dialog.Portal>
        <Overlay />

        <Content>
          <Title>Create new gym</Title>

          <FakemonList
            fakemons={nonStakedFakemons}
            actions={
              <FakemonActions
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
            }
          />

          <div>
            Your {noOfStakedFakemons} fakemons are staked which can't be used
            until freed
          </div>

          <Actions>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>

            <ButtonWithLoader
              variant="primary"
              title={
                selectedIds.length === 0
                  ? "Select fakemons to create gym"
                  : null
              }
              onClick={() => {
                // close(selectedIds);
                setSelectedIds([]);
              }}
              disabled={selectedIds.length === 0}
            >
              Create
            </ButtonWithLoader>
          </Actions>
        </Content>
      </Dialog.Portal>
    </Wrapper>
  );
}

const Wrapper = styled(Dialog.Root)``;
const Overlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.44);
  position: fixed;
  inset: 0;
`;
const Content = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid black;
  padding: 16px;
  background-color: white;

  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Title = styled(Dialog.Title)`
  font-size: ${20 / 16}rem;
  text-align: center;
`;
const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export default Modal;
