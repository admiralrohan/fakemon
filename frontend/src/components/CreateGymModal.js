import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import ButtonWithLoader from "./ButtonWithLoader";

/**
 * Will show list of fakemons owned by user and non-staked fakemons can be chosen to create new gym.
 */
export function CreateGymModal({ show, dismiss, close, fakemons }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const stakedButton = () => (
    <Button variant="secondary" disabled>
      Staked
    </Button>
  );
  const addButton = (fakemon) => (
    <Button
      variant="secondary"
      onClick={() => {
        setSelectedIds([...selectedIds, fakemon.id]);
      }}
    >
      Add
    </Button>
  );
  const removeButton = (fakemon) => (
    <Button
      variant="secondary"
      onClick={() => {
        setSelectedIds([...selectedIds.filter((id) => id !== fakemon.id)]);
      }}
    >
      Remove
    </Button>
  );

  return (
    <Modal show={show} onHide={dismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Create new gym</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {fakemons.map((fakemon) => (
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

            {/* TODO: Optimize use of `array.includes()`, use mapping */}
            {fakemon.gymId > 0
              ? stakedButton()
              : !selectedIds.includes(fakemon.id)
              ? addButton(fakemon)
              : removeButton(fakemon)}
          </div>
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={dismiss}>
          Close
        </Button>

        <ButtonWithLoader
          variant="primary"
          title={selectedIds.length === 0 ? "Select some fakemons" : null}
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
