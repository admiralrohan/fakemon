import styled from "@emotion/styled";
import useAuth from "../../hooks/useAuth";
import useFakemonsByUser from "../../hooks/useFakemonsByUser";
import useIsRegistered from "../../hooks/useIsRegistered";
import useTokenBalance from "../../hooks/useTokenBalance";
import ActionButtons from "./ActionButtons";

function Stats() {
  const { walletAddress } = useAuth();
  const { data: isRegistered } = useIsRegistered();
  const { data: tokenBalance } = useTokenBalance();
  const { data: fakemons } = useFakemonsByUser();

  const truncatedWalletAddress =
    walletAddress.slice(0, 10) + "..." + walletAddress.slice(-6, -1);

  return (
    <Wrapper>
      <Title>User Profile</Title>
      <List>
        <List.DT>Wallet Address</List.DT>
        <List.DD>{truncatedWalletAddress}</List.DD>

        <List.DT>Status</List.DT>
        <List.DD>{isRegistered ? "Registered" : "Unregistered"}</List.DD>

        {isRegistered && (
          <>
            <List.DT>No of Fakemons</List.DT>
            <List.DD>{fakemons.length}</List.DD>

            <List.DT>Token Balance</List.DT>
            <List.DD>{tokenBalance}</List.DD>
          </>
        )}
      </List>

      <ActionButtons />
    </Wrapper>
  );
}

export const Wrapper = styled.div`
  --gap: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: var(--gap);
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.25rem;
  margin: 0;
`;

const List = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: var(--gap);
  row-gap: 0;
  margin: 0;
`;
List.DT = styled.dt``;
List.DD = styled.dd`
  margin: 0;
`;

export default Stats;
