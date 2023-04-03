import Button from "../Button";

function FakemonActions({ fakemon, selectedIds, setSelectedIds }) {
  return !selectedIds.includes(fakemon.id) ? (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => {
        setSelectedIds([...selectedIds, fakemon.id]);
      }}
    >
      Add
    </Button>
  ) : (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => {
        setSelectedIds([...selectedIds.filter((id) => id !== fakemon.id)]);
      }}
    >
      Remove
    </Button>
  );
}

export default FakemonActions;
