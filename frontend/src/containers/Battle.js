import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link, useParams } from "react-router-dom";
import { AlertLayout } from "../components/AlertLayout";
import { BeforeWalletImportNotice } from "../components/BeforeWalletImportNotice";

export function Battle({
  userAddress,
  fakemonsInUserSquad,
  gyms,
  fetchFakemonsByGym,
}) {
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

  const getFakemonView = (fakemon, showUseButton = false) => (
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

          {showUseButton && (
            <Button size="sm" className="mt-2 text-end">
              Use
            </Button>
          )}
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );

  const battleView = (
    <div style={{ width: 500, margin: "25px auto" }}>
      <Link to={"/gyms/" + gymId}>
        <Button size="sm">Back</Button>
      </Link>
      <Card.Title style={{ marginBottom: 10, textAlign: "center" }}>
        Battle with Gym #{gymId}
      </Card.Title>

      <Card.Subtitle style={{ marginBottom: 10, textAlign: "center" }}>
        Your squad
      </Card.Subtitle>

      {/* Only non-staked fakemons can be used for attack */}
      {fakemonsInUserSquad
        .filter((fakemon) => fakemon.gymId !== "0")
        .map((fakemon) => getFakemonView(fakemon, true))}

      <Card.Subtitle
        className="text-center my-3"
        style={{ marginTop: 20, marginBottom: 10, textAlign: "center" }}
      >
        Gym squad
      </Card.Subtitle>

      {fakemonsInGym.map((fakemon) => getFakemonView(fakemon))}

      <div>
        <Button className="me-2">Battle</Button>

        {/* Flee would save remaining energy, but the user will lose the match on record */}
        {/* <Button>Flee</Button> */}
      </div>
    </div>
  );

  return (
    <div style={{ width: 500, margin: "25px auto" }}>
      {!userAddress ? (
        <BeforeWalletImportNotice />
      ) : !gymDetails ? (
        <AlertLayout content="Gym doesn't exist" />
      ) : isOwnGym ? (
        <AlertLayout content="You can't fight with your own gym" />
      ) : (
        battleView
      )}
    </div>
  );
}
