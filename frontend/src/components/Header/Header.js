import React from "react";
import styled from "@emotion/styled";
import { LOCALSTORAGE_KEY } from "../../utils/utils";
import useAuth from "../../hooks/useAuth";
import useTokenBalance from "../../hooks/useTokenBalance";
import useConnectWallet from "../../hooks/useConnectWallet";
import useDetachWallet from "../../hooks/useDetachWallet";
import Button from "../Button";
import NavLink from "./NavLink";

function Header() {
  const { walletAddress } = useAuth();
  const { data: tokenBalance } = useTokenBalance();
  const { mutate: connectWallet } = useConnectWallet();
  const { mutate: detachWallet } = useDetachWallet();

  // Automatically connect if user has logged in session from earlier
  React.useEffect(() => {
    const savedAddress = window.localStorage.getItem(LOCALSTORAGE_KEY);

    if (savedAddress) connectWallet();
  }, [connectWallet]);

  const targetNetwork = process.env.REACT_APP_NETWORK
    ? process.env.REACT_APP_NETWORK
    : "hardhat";

  return (
    <Wrapper>
      <Brand>
        Fakemon
        <Brand.NetworkName>{targetNetwork}</Brand.NetworkName>
      </Brand>

      <NavLinks>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/gyms">Gyms</NavLink>
      </NavLinks>

      <NavActions>
        <Button size="sm" onClick={connectWallet}>
          {walletAddress ? tokenBalance : "Connect wallet"}
        </Button>

        {walletAddress && (
          <Button size="sm" className="ms-2" onClick={detachWallet}>
            Detach wallet
          </Button>
        )}
      </NavActions>
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  color: white;
  background-color: rgba(33, 37, 41, 1);
  padding: 12px 64px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
`;

const Brand = styled.div`
  font-size: ${20 / 16}rem;
  line-height: 30px;
  white-space: nowrap;

  display: flex;
  gap: 8px;
  align-items: baseline;
`;
Brand.NetworkName = styled.span`
  font-size: ${12 / 16}rem;
  border: 1px solid;
  padding: 0px 6px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-right: auto;
`;
const NavActions = styled.div``;

export default Header;
