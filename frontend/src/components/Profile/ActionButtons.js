import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import useIsRegistered from "../../hooks/useIsRegistered";
import useMintFakemon from "../../hooks/useMintFakemon";
import useRegister from "../../hooks/useRegister";
import useToast from "../../hooks/useToast";
import Button from "../Button";
import ButtonWithLoader from "../ButtonWithLoader";

function ActionButtons() {
  const { data: isRegistered } = useIsRegistered();
  const { mutate: registerUser, isLoading: isRegisterUserLoading } =
    useRegister();
  const { mutate: mintFakemon, isLoading: isMintFakemonLoading } =
    useMintFakemon();
  const { showToast } = useToast();

  const getToken = () => {
    showToast("Coming soon");
  };

  if (!isRegistered) {
    return (
      <Actions>
        <ButtonWithLoader
          showLoader={isRegisterUserLoading}
          size="sm"
          onClick={registerUser}
        >
          Register now
        </ButtonWithLoader>
      </Actions>
    );
  }

  return (
    <Actions>
      <Button as={Link} size="sm" to="/gyms">
        Battle now
      </Button>

      <ButtonWithLoader
        showLoader={isMintFakemonLoading}
        size="sm"
        onClick={mintFakemon}
      >
        Mint fakemon
      </ButtonWithLoader>

      <Button size="sm" onClick={getToken}>
        Get token
      </Button>
    </Actions>
  );
}

const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: var(--gap);
`;

export default ActionButtons;
