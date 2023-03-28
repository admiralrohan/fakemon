import styled from "@emotion/styled";
import React from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCurrentBattle from "../../hooks/useCurrentBattle";
import useFakemonsByGym from "../../hooks/useFakemonsByGym";
import useFakemonsByUser from "../../hooks/useFakemonsByUser";
import useGyms from "../../hooks/useGyms";
import useIsRegistered from "../../hooks/useIsRegistered";
import Alert from "../Alert";
import Button from "../Button";
import FakemonList from "../FakemonList";
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
  const [selectedFakemon, setSelectedFakemon] = React.useState(null);

  const { id: gymId } = useParams();
  const gymDetails = gyms.find((gym) => gym.id === gymId);

  const {
    data: { fakemons: fakemonsInGym },
  } = useFakemonsByGym(gymId);

  // Disable link to battle page by default
  const isOwnGym = gymDetails ? gymDetails.owner === walletAddress : true;

  if (!walletAddress) return <ImportWalletAlert />;
  if (!gymDetails) return <Alert>Gym doesn't exist</Alert>;
  if (!isRegistered) return <Alert>You need to register first</Alert>;
  if (isOwnGym) return <Alert>You can't fight with your own gym</Alert>;

  return (
    <Wrapper>
      <Link to={"/gyms/" + gymId}>
        <Button size="sm" className="mb-3">
          Back
        </Button>
      </Link>

      <section>
        <Card.Title className="mb-2 text-center">
          Battle with Gym #{gymId}
        </Card.Title>
        {currentBattle.gymId > 0 && (
          <div className="mb-2 text-center fs-6">
            Battle expiring at {`${currentBattle.expirationTime}`}
          </div>
        )}

        {/* Only non-staked fakemons can be used for attack */}
        <Card.Subtitle className="mb-2 text-center">Your squad</Card.Subtitle>
        {nonStakedFakemonsInUserSquad.length === 0 && (
          <Alert>You have no non-staked Fakemon</Alert>
        )}
        <FakemonList
          fakemons={nonStakedFakemonsInUserSquad}
          showUseButton={true}
        />

        <Card.Subtitle className="text-center my-3">Gym squad</Card.Subtitle>
        <FakemonList fakemons={fakemonsInGym} showUseButton={false} />
      </section>

      <Actions
        selectedFakemon={selectedFakemon}
        setSelectedFakemon={setSelectedFakemon}
      />
    </Wrapper>
  );
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default Battle;
