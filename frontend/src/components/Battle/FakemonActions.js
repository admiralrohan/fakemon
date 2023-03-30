import ButtonWithLoader from "../ButtonWithLoader";
import useAttackFakemon from "../../hooks/useAttackFakemon";
import useFakemonSelect from "../../hooks/useFakemonSelect";
import styled from "@emotion/styled";

function FakemonActions({ fakemon }) {
  const { isLoading } = useAttackFakemon();
  const { selectedFakemon, setSelectedFakemon } = useFakemonSelect();
  const isCurrentFakemonSelected = selectedFakemon === fakemon.id;
  const isFainted = fakemon.hp === "0";

  return (
    <>
      {!selectedFakemon && (
        <ButtonWithLoader
          size="sm"
          disabled={isFainted || isLoading}
          title={isFainted ? "Fainted, can't fight" : null}
          onClick={() => setSelectedFakemon(fakemon.id)}
        >
          Use
        </ButtonWithLoader>
      )}

      {isCurrentFakemonSelected && (
        <ButtonWithLoader size="sm" onClick={() => setSelectedFakemon(null)}>
          De-select
        </ButtonWithLoader>
      )}

      {isFainted && <Badge bg="danger">Fainted</Badge>}
    </>
  );
}

const Badge = styled.div`
  color: white;
  background-color: rgba(220, 53, 69, 1);
  padding: 3px 6px;
`;

export default FakemonActions;
