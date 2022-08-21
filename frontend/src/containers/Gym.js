import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link, useParams } from "react-router-dom";
import { BeforeWalletImportNotice } from "../components/BeforeWalletImportNotice";

export function Gym({ userAddress, fakemons, gyms }) {
  const { id: gymId } = useParams();
  const gymDetails = gyms.find((gym) => gym.id === gymId);

  // Disable link to battle page by default
  const isOwnGym = gymDetails ? gymDetails.owner === userAddress : true;

  // TODO: Filtering multiple times, `useCallback` isn't working.
  const fakemonsInGym = fakemons.filter((fakemon) => fakemon.gymId === gymId);

  const gymNotExistView = () => (
    <Card>
      <Card.Body>
        <Card.Subtitle className="text-center">Gym doesn't exist</Card.Subtitle>
      </Card.Body>
    </Card>
  );

  const existingGymView = () => (
    <div>
      <Link to="/gyms">
        <Button size="sm">Back</Button>
      </Link>

      <Card.Title className="text-center mb-2">Gym #{gymId}</Card.Title>
      <Card.Subtitle className="text-center mb-3">
        Owner {gymDetails.owner}
      </Card.Subtitle>

      {fakemonsInGym.map((fakemon) => (
        <Card className="mb-2" style={{ width: "500px" }} key={fakemon.id}>
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
      ))}

      <Link
        to={`/gyms/${gymId}/battle`}
        style={{ pointerEvents: isOwnGym ? "none" : "pointer" }}
        title={isOwnGym ? "You can't battle against your own gym" : null}
      >
        <Button disabled={isOwnGym}>Battle</Button>
      </Link>
    </div>
  );

  return (
    <div style={{ width: 500, margin: "25px auto" }}>
      {!userAddress ? (
        <BeforeWalletImportNotice />
      ) : gymDetails ? (
        existingGymView()
      ) : (
        <AlertLayout content="Gym doesn't exist" />
      )}
    </div>
  );
}
