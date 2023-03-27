import styled from "@emotion/styled";
import useFakemonsByUser from "../../hooks/useFakemonsByUser";
import Alert from "../Alert";
import FakemonView from "../FakemonView";

function UserSquad() {
  const { data: fakemons } = useFakemonsByUser();
  return (
    <Wrapper>
      <Title>Your Squad</Title>

      {fakemons.length === 0 && <Alert>You have no fakemons</Alert>}
      <FakemonWrapper>
        {fakemons.map((fakemon) => (
          <FakemonView key={fakemon.id} fakemon={fakemon} />
        ))}
      </FakemonWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.25rem;
  margin: 0;
`;

const FakemonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default UserSquad;
