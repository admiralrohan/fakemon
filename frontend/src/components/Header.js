import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";
import { useConnectWallet, useDetachWallet } from "../utils/mutations";
import { useEffect } from "react";
import { LOCALSTORAGE_KEY } from "../utils/data.service";

export function Header({
  // walletAddress,
  tokenBalance,
  // connectWalletHandler,
  // detachWalletHandler,
}) {
  const walletAddress = window.localStorage.getItem(LOCALSTORAGE_KEY);
  const { mutate: connectWallet } = useConnectWallet();
  const { mutate: detachWallet } = useDetachWallet();

  // Automatically connect if user has logged in session from earlier
  useEffect(() => {
    if (walletAddress) connectWallet();
  }, [connectWallet, walletAddress]);

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>Fakemon</Navbar.Brand>

        <Nav className="me-auto">
          <LinkContainer to="/profile">
            <Nav.Link>Profile</Nav.Link>
          </LinkContainer>

          <LinkContainer to="/gyms">
            <Nav.Link>Gyms</Nav.Link>
          </LinkContainer>
        </Nav>

        <Nav>
          {/* TODO: When loading disable button */}
          <Button size="sm" onClick={connectWallet}>
            {walletAddress ? tokenBalance : "Connect wallet"}
          </Button>

          {walletAddress && (
            <Button size="sm" className="ms-2" onClick={detachWallet}>
              Detach wallet
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
