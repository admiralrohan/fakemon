import styled from "@emotion/styled";
import React from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCurrentBattle from "../../hooks/useCurrentBattle";
import useFakemonsByGym from "../../hooks/useFakemonsByGym";
import useFakemonsByUser from "../../hooks/useFakemonsByUser";
import useGyms from "../../hooks/useGyms";
import useIsRegistered from "../../hooks/useIsRegistered";
import Alert from "../Alert";
import FakemonList from "../FakemonList";
import FakemonSelectProvider from "../FakemonSelectProvider";
import ImportWalletAlert from "../ImportWalletAlert";
import Actions from "./Actions";

function Battle() {
  const { walletAddress } = useAuth();
  const { data: isRegistered } = useIsRegistered();
  const { data: fakemonsInUserSquad } = useFakemonsByUser();
  const { data: gyms } = useGyms();
  const { data: currentBattle } = useCurrentBattle();

  const nonStakedFakemonsInUserSquad = fakemonsInUserSquad.filter(
    (fakemon) => fakemon.gymId === "0"
  );

  const { id: gymId } = useParams();
  const gymDetails = gyms.find((gym) => gym.id === gymId);

  const {
    data: { fakemons: fakemonsInGym },
  } = useFakemonsByGym(gymId);

  // Disable link to battle page by default
  const isOwnGym = gymDetails ? gymDetails.owner === walletAddress : true;
  const isBattleLive = currentBattle.gymId > 0;

  if (!walletAddress) return <ImportWalletAlert />;
  if (!gymDetails) return <Alert>Gym doesn't exist</Alert>;
  if (!isRegistered) return <Alert>You need to register first</Alert>;
  if (isOwnGym) return <Alert>You can't fight with your own gym</Alert>;

  return (
    <FakemonSelectProvider>
      <Wrapper>
        <TitleWrapper>
          <Title>Battle with Gym #{gymId}</Title>
          {isBattleLive && (
            <BattleExpiryText>
              Battle expiring at {`${currentBattle.expirationTime}`}
            </BattleExpiryText>
          )}
        </TitleWrapper>

        <MainSection>
          <YourSquad>
            {/* Only non-staked fakemons can be used for attack */}
            <SquadHeading>Your squad</SquadHeading>

            {nonStakedFakemonsInUserSquad.length === 0 && (
              <Alert>You have no non-staked Fakemon</Alert>
            )}

            <FakemonList
              fakemons={nonStakedFakemonsInUserSquad}
              showUseButton={true}
            />
          </YourSquad>

          <GymSquad>
            <SquadHeading>Gym squad</SquadHeading>
            <FakemonList fakemons={fakemonsInGym} showUseButton={false} />
          </GymSquad>
        </MainSection>

        <Actions />
      </Wrapper>
    </FakemonSelectProvider>
  );
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const TitleWrapper = styled.div`
  text-align: center;
`;
const Title = styled.h1`
  font-size: 1.25rem;
  margin: 0;
`;
const BattleExpiryText = styled.h2`
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
`;

const MainSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const YourSquad = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const GymSquad = styled(YourSquad)``;
const SquadHeading = styled.h2`
  text-align: center;
  font-size: 1.15rem;
  margin: 0;
  font-weight: 600;
`;

export default Battle;
