import React from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import ImportWalletAlert from "../ImportWalletAlert";
import Alert from "../Alert";
import useAuth from "../../hooks/useAuth";
import useGyms from "../../hooks/useGyms";
import useFakemonsByGym from "../../hooks/useFakemonsByGym";
import FakemonList from "../FakemonList";
import ActionButtons from "./ActionButtons";

function Gym() {
  const { id: gymId } = useParams();
  const { walletAddress } = useAuth();
  const { data: gyms } = useGyms();
  const {
    data: { fakemons: fakemonsInGym },
  } = useFakemonsByGym(gymId);

  const gymDetails = gyms.find((gym) => gym.id === gymId);
  // Disable link to battle page by default
  const isOwnGym = gymDetails ? gymDetails.owner === walletAddress : true;

  if (!walletAddress) return <ImportWalletAlert />;
  if (!gymDetails) return <Alert>Gym doesn't exist</Alert>;

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>Gym #{gymId}</Title>
        <Subtitle>Owner {gymDetails.owner}</Subtitle>
      </TitleWrapper>

      {/* We are certain as user can't create gym without fakemon */}
      {fakemonsInGym.length === 0 ? (
        <Alert>Can't fetch details, reload page</Alert>
      ) : (
        <FakemonList fakemons={fakemonsInGym} />
      )}

      <ActionButtons
        gymId={gymId}
        isOwnGym={isOwnGym}
        noOfFakemons={fakemonsInGym.length}
      />
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TitleWrapper = styled.div``;
const Title = styled.h1`
  text-align: center;
  font-size: 1.25rem;
  margin: 0;
`;
const Subtitle = styled.h2`
  text-align: center;
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
`;

export default Gym;
