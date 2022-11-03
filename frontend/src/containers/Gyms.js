import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CreateGymModal } from "../components/CreateGymModal";
import { BeforeWalletImportNotice } from "../components/BeforeWalletImportNotice";
import { AlertLayout } from "../components/AlertLayout";
import { ButtonWithLoader } from "../components/ButtonWithLoader";
import {
  useFakemonsByUser,
  useGyms,
  useIsRegistered,
} from "../utils/data.service";
import { useCreateGym } from "../utils/mutations";
import { useAuth } from "../context/auth-context";

export function Gyms({ showLoader }) {
  const [showModal, setShowModal] = useState(false);

  const { walletAddress } = useAuth();
  const { data: isRegistered } = useIsRegistered();
  const { data: fakemons } = useFakemonsByUser();
  const { data: gyms } = useGyms();

  const { mutate: createGym } = useCreateGym();

  const gymList = gyms.map((gym) => (
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

  const afterWalletImportView = (
    <>
      <div className="text-end">
        <ButtonWithLoader
          showLoader={showLoader.createGym}
          size="sm"
          disabled={!isRegistered}
          title={!isRegistered ? "You need to register to create gym" : null}
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

      {gyms.length === 0 ? <AlertLayout content="No gyms yet" /> : gymList}
    </>
  );

  return (
    <div style={{ width: "500px", margin: "25px auto" }}>
      {!walletAddress ? <BeforeWalletImportNotice /> : afterWalletImportView}
    </div>
  );
}
