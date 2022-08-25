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
  startBattle,
  fleeBattle,
  endBattle,
  attackFakemon,
  currentBattle,
  fakemonsInGym,
}) {
  const [selectedFakemon, setSelectedFakemon] = useState(null);

  const { id: gymId } = useParams();
  const gymDetails = gyms.find((gym) => gym.id === gymId);

  // Disable link to battle page by default
  const isOwnGym = gymDetails ? gymDetails.owner === userAddress : true;

  useEffect(() => {
    (async () => {
      await fetchFakemonsByGym(gymId);
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
            <div>
              {!selectedFakemon && (
                <span
                  title={fakemon.hp === "0" ? "Don't have HP to fight" : null}
                >
                  <Button
                    size="sm"
                    className="text-end"
                    disabled={fakemon.hp === "0"}
                    onClick={() => setSelectedFakemon(fakemon.id)}
                  >
                    Use
                  </Button>
                </span>
              )}

              {selectedFakemon === fakemon.id && (
                <Button
                  size="sm"
                  className="text-end"
                  onClick={() => setSelectedFakemon(null)}
                >
                  De-select
                </Button>
              )}
            </div>
          )}
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );

  const buttonView = (
    <>
      {currentBattle.isWon ? (
        <>
          <Card.Title className="mb-2 mt-3">You Won!</Card.Title>

          <Button className="me-2" onClick={() => endBattle(gymId)}>
            End Battle
          </Button>
        </>
      ) : currentBattle.gymId === "0" ? (
        <Button className="me-2" onClick={() => startBattle(gymId)}>
          Start Battle
        </Button>
      ) : (
        <div>
          <span title={!selectedFakemon ? "Select an fakemon to attack" : null}>
            <Button
              className="me-2"
              disabled={!selectedFakemon}
              onClick={() => {
                attackFakemon(selectedFakemon);
                setSelectedFakemon(null); // To prevent highlighted button "De-select" after attack
              }}
            >
              Attack
            </Button>
          </span>

          {/* Flee would save remaining energy, but the user will lose the match on record */}
          <span
            title={!selectedFakemon ? null : "De-select an fakemons to flee"}
          >
            <Button disabled={selectedFakemon} onClick={() => fleeBattle()}>
              Flee
            </Button>
          </span>
        </div>
      )}
    </>
  );

  const battleView = (
    <div style={{ width: 500, margin: "25px auto" }}>
      <Link to={"/gyms/" + gymId}>
        <Button size="sm">Back</Button>
      </Link>

      <Card.Title className="mb-2 text-center">
        Battle with Gym #{gymId}
      </Card.Title>
      {currentBattle.gymId > 0 && (
        <div className="mb-2 text-center fs-6">
          Battle expiring at {`${currentBattle.expirationTime}`}
        </div>
      )}

      <Card.Subtitle className="mb-2 text-center">Your squad</Card.Subtitle>

      {/* Only non-staked fakemons can be used for attack */}
      {fakemonsInUserSquad
        .filter((fakemon) => fakemon.gymId !== "0")
        .map((fakemon) => getFakemonView(fakemon, true))}

      <Card.Subtitle className="text-center my-3">Gym squad</Card.Subtitle>

      {fakemonsInGym.map((fakemon) => getFakemonView(fakemon))}
      {buttonView}
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
