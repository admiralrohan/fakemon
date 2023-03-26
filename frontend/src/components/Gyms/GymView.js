import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styled from "@emotion/styled";
import Button from "../Button";

function GymView({ gym }) {
  const { walletAddress } = useAuth();

  return (
    <Wrapper>
      <Title>
        Gym #{gym.id}{" "}
        {gym.owner === walletAddress && (
          <Title.AddedNote>(Mine)</Title.AddedNote>
        )}
      </Title>

      <Button as={Link} size="sm" to={"/gyms/" + gym.id}>
        Check squad
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border: 1px solid;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h4`
  font-size: 1.25rem;
  text-align: center;
`;
Title.AddedNote = styled.span`
  font-size: 1rem;
  font-weight: 400;
`;

export default GymView;
