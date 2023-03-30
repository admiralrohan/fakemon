import React from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "../Button";
import ButtonWithLoader from "../ButtonWithLoader";

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
        {nonStakedFakemons.map((fakemon) => (
          <div className="d-flex mb-2" key={fakemon.id}>
            <Card className="me-2" style={{ width: "400px" }}>
              <Card.Body>
                <Card.Title>Fakemon #{fakemon.id}</Card.Title>
                <Card.Subtitle className="d-flex justify-content-between align-items-baseline">
                  <span>
                    <strong>HP:</strong> {fakemon.hp}
                  </span>
                  <span>
                    <strong>Attack:</strong> {fakemon.attack}
                  </span>
                  <span>
                    <strong>Defense:</strong> {fakemon.defense}
                  </span>
                </Card.Subtitle>
              </Card.Body>
            </Card>

            {!selectedIds.includes(fakemon.id) ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedIds([...selectedIds, fakemon.id]);
                }}
              >
                Add
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedIds([
                    ...selectedIds.filter((id) => id !== fakemon.id),
                  ]);
                }}
              >
                Remove
              </Button>
            )}
          </div>
        ))}

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
