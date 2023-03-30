import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "../Button";
import ButtonWithLoader from "../ButtonWithLoader";
import FakemonList from "../FakemonList";
import FakemonActions from "./FakemonActions";

/**
 * Will show list of non-staked fakemons which can be chosen to create new gym.
 */
function CreateGymModal({ show, dismiss, close, fakemons }) {
  const [selectedIds, setSelectedIds] = React.useState([]);

  const nonStakedFakemons = fakemons.filter((fakemon) => fakemon.gymId === "0");
  const noOfStakedFakemons = fakemons.length - nonStakedFakemons.length;

  return (
    <Modal show={show} onHide={dismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Create new gym</Modal.Title>
      </Modal.Header>

      <Modal.Body>
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
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={dismiss}>
          Close
        </Button>

        <ButtonWithLoader
          variant="primary"
          title={
            selectedIds.length === 0 ? "Select fakemons to create gym" : null
          }
          onClick={() => {
            close(selectedIds);
            setSelectedIds([]);
          }}
          disabled={selectedIds.length === 0}
        >
          Create
        </ButtonWithLoader>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateGymModal;
