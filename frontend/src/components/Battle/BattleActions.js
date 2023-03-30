import styled from "@emotion/styled";
import React from "react";
import { Link, useParams } from "react-router-dom";
import useAttackFakemon from "../../hooks/useAttackFakemon";
import useCurrentBattle from "../../hooks/useCurrentBattle";
import useEndBattle from "../../hooks/useEndBattle";
import useFakemonsByUser from "../../hooks/useFakemonsByUser";
import useFakemonSelect from "../../hooks/useFakemonSelect";
import useFleeBattle from "../../hooks/useFleeBattle";
import useStartBattle from "../../hooks/useStartBattle";
import Button from "../Button";
import ButtonWithLoader from "../ButtonWithLoader";

function BattleActions() {
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

  const { selectedFakemon, setSelectedFakemon } = useFakemonSelect();

  const isGymFreeToBattle = currentBattle.gymId === "0";
  const isBattleOngoing = currentBattle.gymId === gymId && !currentBattle.isWon;

  return (
    <Wrapper>
      {currentBattle.isWon && <Title>You Won!</Title>}

      <ButtonList>
        <Button as={Link} to={"/gyms/" + gymId} size="sm">
          Back
        </Button>

        {isGymFreeToBattle && (
          <ButtonWithLoader
            size="sm"
            showLoader={isStartBattleLoading}
            disabled={nonStakedFakemonsInUserSquad.length === 0}
            title={
              nonStakedFakemonsInUserSquad.length === 0
                ? "No pokemon to fight with"
                : null
            }
            onClick={() => startBattle(gymId)}
          >
            Start Battle
          </ButtonWithLoader>
        )}

        {currentBattle.isWon && (
          <ButtonWithLoader
            size="sm"
            showLoader={isEndBattleLoading}
            onClick={() => endBattle(gymId)}
          >
            End Battle
          </ButtonWithLoader>
        )}

        {isBattleOngoing && (
          <>
            {/* You shouldn't attack while fleeing, but no extra condition is required for `disabled`. ALready covered by existing checks. */}
            <ButtonWithLoader
              size="sm"
              showLoader={isAttackFakemonLoading}
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
              size="sm"
              showLoader={isFleeBattleLoading}
              disabled={selectedFakemon || isAttackFakemonLoading}
              title={!selectedFakemon ? null : "De-select an fakemons to flee"}
              onClick={() => fleeBattle()}
            >
              Flee
            </ButtonWithLoader>
          </>
        )}
      </ButtonList>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;
const ButtonList = styled.div`
  display: flex;
  gap: 8px;
`;

const Title = styled.h3`
  text-align: center;
  font-size: 1.25rem;
  margin: 0;
`;

export default BattleActions;
