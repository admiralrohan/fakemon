import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export function CreateGymModal({ show, close }) {
  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Create new gym</Modal.Title>
      </Modal.Header>

      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" onClick={close}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
