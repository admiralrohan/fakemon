import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { useCreateGym } from "../../hooks/mutations";
import {
  useFakemonsByUser,
  useGyms,
  useIsRegistered,
} from "../../hooks/queries";
import Alert from "../Alert";
import ButtonWithLoader from "../ButtonWithLoader";
import CreateGymModal from "../CreateGymModal";
import ImportWalletAlert from "../ImportWalletAlert";

function Gyms() {
  const [showModal, setShowModal] = React.useState(false);

  const { walletAddress } = useAuth();
  const { data: isRegistered } = useIsRegistered();
  const { data: fakemons } = useFakemonsByUser();
  const { data: gyms } = useGyms();

  const { mutate: createGym, isLoading: isCreateGymLoading } = useCreateGym();

  if (!walletAddress) return <ImportWalletAlert />;

  return (
    <>
      <div className="text-end">
        <ButtonWithLoader
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
        </ButtonWithLoader>
      </div>
      <Card.Title className="mb-3 text-center">Gyms</Card.Title>

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
    </>
  );
}

function GymList() {
  const { walletAddress } = useAuth();
  const { data: gyms } = useGyms();

  return gyms.map((gym) => (
    <Card className="mb-2" style={{ width: "500px" }} key={gym.id}>
      <Card.Body className="d-flex justify-content-between">
        <Card.Title>
          Gym #{gym.id}{" "}
          {gym.owner === walletAddress && <span className="fs-6">(Mine)</span>}
        </Card.Title>

        <Link to={"/gyms/" + gym.id}>
          <Button size="sm">Check squad</Button>
        </Link>
      </Card.Body>
    </Card>
  ));
}

export default Gyms;
