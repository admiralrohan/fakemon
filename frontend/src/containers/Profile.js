import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { BeforeWalletImportNotice } from "../components/BeforeWalletImportNotice";
import { ButtonWithLoader } from "../components/ButtonWithLoader";
import { AlertLayout } from "../components/AlertLayout";
import {
  useFakemonsByUser,
  useIsRegistered,
  useTokenBalance,
} from "../hooks/queries";
import { useMintFakemon, useRegister } from "../hooks/mutations";
import { useAuth } from "../context/auth-context";
import { CardText } from "../utils/styled-components";
import { useToast } from "../context/toast-context";

export function Profile() {
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

  const afterWalletImportView = (
    <>
      <Card>
        <Card.Body>
          <Card.Title>User Profile</Card.Title>

          <CardText>
            <strong>Wallet address:</strong> {walletAddress}
          </CardText>
          {isRegistered ? (
            <>
              <CardText>
                <strong>No of fakemons:</strong> {fakemons.length}
              </CardText>
              {/* <CardText>
                <strong>No of battles won:</strong> {profileDetails.won} of{" "}
                {profileDetails.totalMatches}
              </CardText> */}
              <CardText>
                <strong>Token balance:</strong> {tokenBalance}
              </CardText>
              {/* <CardText>
                <strong>Joined on:</strong> {profileDetails.joinedOn}
              </CardText> */}

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
            </>
          ) : (
            <>
              <CardText>
                <strong>Status:</strong> Unregistered
              </CardText>

              <ButtonWithLoader
                showLoader={isRegisterUserLoading}
                size="sm"
                className="mt-2"
                onClick={registerUser}
              >
                Register now
              </ButtonWithLoader>
            </>
          )}
        </Card.Body>
      </Card>

      {/* User squad */}
      <h4 className="text-center mt-3 mb-2">Your Squad</h4>
      {fakemons.length === 0 && <AlertLayout content="You have no fakemons" />}

      {fakemons.map((fakemon) => (
        <Card className="mb-2" style={{ width: "500px" }} key={fakemon.id}>
          <Card.Body>
            <Card.Title>Fakemon #{fakemon.id}</Card.Title>
            <Card.Subtitle className="d-flex justify-content-between align-items-baseline">
              <span>
                <strong>HP:</strong> {fakemon.hp}
              </span>
              <span>
                <strong>Attack:</strong> {fakemon.attack}
              </span>
              <span>
                <strong>Defense:</strong> {fakemon.defense}
              </span>
            </Card.Subtitle>
          </Card.Body>
        </Card>
      ))}
    </>
  );

  return (
    <div style={{ width: "500px", margin: "25px auto" }}>
      {walletAddress ? afterWalletImportView : <BeforeWalletImportNotice />}
    </div>
  );
}
