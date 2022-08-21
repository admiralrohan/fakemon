import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CreateGymModal } from "../components/CreateGymModal";
import { BeforeWalletImportNotice } from "../components/BeforeWalletImportNotice";

export function Gyms({ userAddress, gyms, fakemons, createGym }) {
  const [showModal, setShowModal] = useState(false);

  const noGymsView = (
    <Card>
      <Card.Body>
        <Card.Subtitle className="text-center">No gyms yet</Card.Subtitle>
      </Card.Body>
    </Card>
  );

  const gymList = gyms.map((gym) => (
    <Card className="mb-2" style={{ width: "500px" }} key={gym.id}>
      <Card.Body
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Card.Title>Gym #{gym.id}</Card.Title>

        <Link to={"/gyms/" + gym.id}>
          <Button size="sm">Check squad</Button>
        </Link>
      </Card.Body>
    </Card>
  ));

  const afterWalletImportView = (
    <>
      <div className="text-end">
        <Button size="sm" onClick={() => setShowModal(true)}>
          Create gym
        </Button>
      </div>
      <Card.Title className="mb-3 text-center">Gyms</Card.Title>

      <CreateGymModal
        show={showModal}
        dismiss={() => setShowModal(false)}
        close={(selectedIds) => {
          setShowModal(false);
          createGym(selectedIds);
        }}
        fakemons={fakemons}
      />

      {gyms.length === 0 ? noGymsView : gymList}
    </>
  );

  return (
    <div style={{ width: "500px", margin: "25px auto" }}>
      {!userAddress ? <BeforeWalletImportNotice /> : afterWalletImportView}
    </div>
  );
}
