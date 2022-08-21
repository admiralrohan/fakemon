import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link, useParams } from "react-router-dom";
import { AlertLayout } from "../components/AlertLayout";
import { BeforeWalletImportNotice } from "../components/BeforeWalletImportNotice";

export function Gym({ userAddress, fetchFakemonsByGym, gyms }) {
  const [fakemonsInGym, setFakemonsInGym] = useState([]);

  const { id: gymId } = useParams();
  const gymDetails = gyms.find((gym) => gym.id === gymId);

  // Disable link to battle page by default
  const isOwnGym = gymDetails ? gymDetails.owner === userAddress : true;

  useEffect(() => {
    (async () => {
      const fakemonList = await fetchFakemonsByGym(gymId);
      if (fakemonList) setFakemonsInGym(fakemonList);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  const existingGymView = () => (
    <div>
      <Link to="/gyms">
        <Button size="sm">Back</Button>
      </Link>
      <Card.Title className="text-center mb-2">Gym #{gymId}</Card.Title>
      <Card.Subtitle className="text-center mb-3">
        Owner {gymDetails.owner}
      </Card.Subtitle>

      {/* We are certain as user can't create gym without fakemon */}
      {fakemonsInGym.length === 0 ? (
        <AlertLayout content="Can't fetch details, reload page" />
      ) : (
        fakemonsInGym.map((fakemon) => (
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
        ))
      )}

      <div
        title={
          fakemonsInGym.length === 0
            ? "Reload page"
            : isOwnGym
            ? "You can't battle against your own gym"
            : null
        }
      >
        <Link
          to={`/gyms/${gymId}/battle`}
          style={{
            pointerEvents:
              isOwnGym || fakemonsInGym.length === 0 ? "none" : "auto",
          }}
        >
          <Button
            disabled={isOwnGym || fakemonsInGym.length === 0}
            title={
              isOwnGym
                ? "You can't battle against your own gym"
                : fakemonsInGym.length === 0
                ? "Reload page"
                : null
            }
          >
            Battle
          </Button>
        </Link>
      </div>
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
