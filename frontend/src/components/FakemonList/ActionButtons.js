import ButtonWithLoader from "../ButtonWithLoader";
import useListContext from "./useListContext";
import useAttackFakemon from "../../hooks/useAttackFakemon";

function ActionButtons({ fakemon }) {
  const { isLoading } = useAttackFakemon();
  const { selectedFakemon, setSelectedFakemon } = useListContext();
  const isCurrentFakemonSelected = selectedFakemon === fakemon.id;

  return (
    <>
      {!selectedFakemon && (
        <ButtonWithLoader
          size="sm"
          disabled={fakemon.hp === "0" || isLoading}
          title={fakemon.hp === "0" ? "Don't have HP to fight" : null}
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
