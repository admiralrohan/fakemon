import ButtonWithLoader from "../ButtonWithLoader";
import useListContext from "./useListContext";
import useAttackFakemon from "../../hooks/useAttackFakemon";

function ActionButtons({ fakemon }) {
  const { isLoading } = useAttackFakemon();
  const { selectedFakemon, setSelectedFakemon } = useListContext();
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
    </>
  );
}

export default ActionButtons;
