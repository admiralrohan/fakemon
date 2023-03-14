import React from "react";
import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";
import {
  useAttackFakemon,
  useEndBattle,
  useFleeBattle,
  useStartBattle,
} from "../../hooks/mutations";
import { useCurrentBattle, useFakemonsByUser } from "../../hooks/queries";
import ButtonWithLoader from "../ButtonWithLoader";

function Actions({ selectedFakemon, setSelectedFakemon }) {
  const { data: currentBattle } = useCurrentBattle();
  const { data: fakemonsInUserSquad } = useFakemonsByUser();

  const { mutate: startBattle, isLoading: isStartBattleLoading } =
    useStartBattle();
  const { mutate: fleeBattle, isLoading: isFleeBattleLoading } =
    useFleeBattle();
  const { mutate: endBattle, isLoading: isEndBattleLoading } = useEndBattle();
  const { mutate: attackFakemon, isLoading: isAttackFakemonLoading } =
    useAttackFakemon();

  const nonStakedFakemonsInUserSquad = fakemonsInUserSquad.filter(
    (fakemon) => fakemon.gymId === "0"
  );
  const { id: gymId } = useParams();

  // End battle
  if (currentBattle.isWon) {
    return (
      <>
        <Card.Title className="mb-2 mt-3">You Won!</Card.Title>

        <ButtonWithLoader
          showLoader={isEndBattleLoading}
          className="me-2"
          onClick={() => endBattle(gymId)}
        >
          End Battle
        </ButtonWithLoader>
      </>
    );
  }

  // Start battle
  if (currentBattle.gymId === "0") {
    return (
      <ButtonWithLoader
        showLoader={isStartBattleLoading}
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
    );
  }

  // During battle
  return (
    <div>
      {/* You shouldn't attack while fleeing, but no extra condition is required for `disabled`. ALready covered by existing checks. */}
      <ButtonWithLoader
        showLoader={isAttackFakemonLoading}
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
        showLoader={isFleeBattleLoading}
        disabled={selectedFakemon || isAttackFakemonLoading}
        title={!selectedFakemon ? null : "De-select an fakemons to flee"}
        onClick={() => fleeBattle()}
      >
        Flee
      </ButtonWithLoader>
    </div>
  );
}

export default Actions;
