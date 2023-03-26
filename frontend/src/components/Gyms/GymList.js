import useAuth from "../../hooks/useAuth";
import useGyms from "../../hooks/useGyms";
import styled from "@emotion/styled";
import GymView from "./GymView";

function GymList() {
  const { data: gyms } = useGyms();

  return (
    <Wrapper>
      {gyms.map((gym) => (
        <GymView key={gym.id} gym={gym} />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default GymList;
