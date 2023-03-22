import styled from "@emotion/styled";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useFakemonsByUser from "../../hooks/useFakemonsByUser";
import useIsRegistered from "../../hooks/useIsRegistered";
import useMintFakemon from "../../hooks/useMintFakemon";
import useRegister from "../../hooks/useRegister";
import useToast from "../../hooks/useToast";
import useTokenBalance from "../../hooks/useTokenBalance";
import ButtonWithLoader from "../ButtonWithLoader";

function Stats() {
  const { walletAddress } = useAuth();
  const { data: isRegistered } = useIsRegistered();
  const { data: tokenBalance } = useTokenBalance();
  const { data: fakemons } = useFakemonsByUser();

  const { mutate: registerUser, isLoading: isRegisterUserLoading } =
    useRegister();
  const { mutate: mintFakemon, isLoading: isMintFakemonLoading } =
    useMintFakemon();

  const { showToast } = useToast();

  const getToken = () => {
    // TODO: Implement
    showToast("Coming soon");
  };

  const truncatedWalletAddress =
    walletAddress.slice(0, 10) + "..." + walletAddress.slice(-6, -1);

  return (
    <Wrapper>
      <Title>User Profile</Title>
      <List>
        <dt>Wallet Address</dt>
        <dd>{truncatedWalletAddress}</dd>

        <dt>No of Fakemons</dt>
        <dd>{fakemons.length}</dd>

        <dt>Token Balance</dt>
        <dd>{tokenBalance}</dd>
      </List>

      <Actions>
        <Link to="/gyms">
          <Button size="sm" className="mt-2">
            Battle now
          </Button>
        </Link>

        <ButtonWithLoader
          showLoader={isMintFakemonLoading}
          size="sm"
          className="mt-2 ms-2"
          onClick={mintFakemon}
        >
          Mint fakemon
        </ButtonWithLoader>

        <Button size="sm" className="mt-2 ms-2" onClick={getToken}>
          Get token
        </Button>
      </Actions>
    </Wrapper>
  );
}

export const Wrapper = styled.div`
  /* border: 1px solid; */
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;
const Title = styled.h2`
  text-align: center;
  font-size: 1.25rem;
`;
const List = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 16px;
  row-gap: 0;
`;
const Actions = styled.div`
  display: flex;
  justify-content: center;
`;

export default Stats;
