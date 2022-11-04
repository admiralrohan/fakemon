import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link, useParams } from "react-router-dom";
import { AlertLayout } from "../components/AlertLayout";
import { BeforeWalletImportNotice } from "../components/BeforeWalletImportNotice";
import { ButtonWithLoader } from "../components/ButtonWithLoader";
import { useAuth } from "../context/auth-context";
import {
  useCurrentBattle,
  useFakemonsByGym,
  useFakemonsByUser,
  useGyms,
} from "../hooks/queries";
import {
  useAttackFakemon,
  useEndBattle,
  useFleeBattle,
  useStartBattle,
} from "../hooks/mutations";

export function Battle({ showLoader }) {
  const { walletAddress } = useAuth();
  const { data: fakemonsInUserSquad } = useFakemonsByUser();
  const { data: gyms } = useGyms();
  const { data: currentBattle } = useCurrentBattle();

  const { mutate: startBattle } = useStartBattle();
  const { mutate: fleeBattle } = useFleeBattle();
  const { mutate: endBattle } = useEndBattle();
  const { mutate: attackFakemon } = useAttackFakemon();

  const nonStakedFakemonsInUserSquad = fakemonsInUserSquad.filter(
    (fakemon) => fakemon.gymId === "0"
  );
  const [selectedFakemon, setSelectedFakemon] = useState(null);

  const { id: gymId } = useParams();
  const gymDetails = gyms.find((gym) => gym.id === gymId);

  const {
    data: { fakemons: fakemonsInGym },
  } = useFakemonsByGym(gymId);

  // Disable link to battle page by default
  const isOwnGym = gymDetails ? gymDetails.owner === walletAddress : true;

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
                <ButtonWithLoader
                  size="sm"
                  className="text-end"
                  disabled={fakemon.hp === "0" || showLoader.attackFakemon}
                  title={fakemon.hp === "0" ? "Don't have HP to fight" : null}
                  onClick={() => setSelectedFakemon(fakemon.id)}
                >
                  Use
                </ButtonWithLoader>
              )}

              {selectedFakemon === fakemon.id && (
                <ButtonWithLoader
                  size="sm"
                  className="text-end"
                  onClick={() => setSelectedFakemon(null)}
                >
                  De-select
                </ButtonWithLoader>
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

          <ButtonWithLoader
            showLoader={showLoader.battle}
            className="me-2"
            onClick={() => endBattle(gymId)}
          >
            End Battle
          </ButtonWithLoader>
        </>
      ) : currentBattle.gymId === "0" ? (
        <ButtonWithLoader
          showLoader={showLoader.battle}
          disabled={nonStakedFakemonsInUserSquad.length === 0}
          title={
            nonStakedFakemonsInUserSquad.length === 0
              ? "No pokemon to fight with"
              : null
          }
          className="me-2"
          onClick={() => startBattle(gymId)}
        >
          Start Battle
        </ButtonWithLoader>
      ) : (
        <div>
          {/* You shouldn't attack while fleeing, but no extra condition is required for `disabled`. ALready covered by existing checks. */}
          <ButtonWithLoader
            showLoader={showLoader.attackFakemon}
            className="me-2"
            disabled={!selectedFakemon}
            title={!selectedFakemon ? "Select an fakemon to attack" : null}
            onClick={() => {
              attackFakemon(selectedFakemon);
              setSelectedFakemon(null); // To prevent highlighted button "De-select" after attack
            }}
          >
            Attack
          </ButtonWithLoader>

          {/* Flee would save remaining energy, but the user will lose the match on record */}
          {/* You shouldn't flee while an attack is ongoing, so added extra condition for `disabled` */}
          <ButtonWithLoader
            showLoader={showLoader.fleeBattle}
            disabled={selectedFakemon || showLoader.attackFakemon}
            title={!selectedFakemon ? null : "De-select an fakemons to flee"}
            onClick={() => fleeBattle()}
          >
            Flee
          </ButtonWithLoader>
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

      {nonStakedFakemonsInUserSquad.length === 0 && (
        <AlertLayout content="You have no non-staked Fakemon" />
      )}

      {/* Only non-staked fakemons can be used for attack */}
      {nonStakedFakemonsInUserSquad.map((fakemon) =>
        getFakemonView(fakemon, true)
      )}

      <Card.Subtitle className="text-center my-3">Gym squad</Card.Subtitle>

      {fakemonsInGym.map((fakemon) => getFakemonView(fakemon))}
      {buttonView}
    </div>
  );

  return (
    <div style={{ width: 500, margin: "25px auto" }}>
      {!walletAddress ? (
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
