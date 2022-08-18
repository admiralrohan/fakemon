import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CreateGymModal } from "../components/CreateGymModal";

export function Gyms({ gyms }) {
  // TODO: Fetch list of gyms from blockchain
  const gymIds = [1, 2, 3];
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ width: 500, margin: "25px auto" }}>
      <div className="text-end">
        {/* TODO: Open modal with NFT list, select from there */}
        <Button size="sm" onClick={() => setShowModal(true)}>
          Create gym
        </Button>
      </div>
      <Card.Title className="mb-3 text-center">Gyms</Card.Title>

      <CreateGymModal show={showModal} close={() => setShowModal(false)} />

      {gymIds.map((gymId) => (
        <Card style={{ width: "500px", marginBottom: 10 }} key={gymId}>
          <Card.Body
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Card.Title>Gym #{gymId}</Card.Title>

            <Link to={"/gyms/" + gymId}>
              <Button size="sm">Check squad</Button>
            </Link>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
