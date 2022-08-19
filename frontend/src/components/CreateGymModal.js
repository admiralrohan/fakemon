import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";

export function CreateGymModal({ show, dismiss, close, fakemons }) {
  const [selectedIds, setSelectedIds] = useState([]);

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

            {/* TODO: Optimize searching from array, use mapping */}
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
                    ...selectedIds,
                    selectedIds.filter((id) => id !== fakemon.id),
                  ]);
                }}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={dismiss}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => close(selectedIds)}
          disabled={selectedIds.length === 0}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
