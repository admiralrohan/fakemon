import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { CardText } from "../utils/utils";
import { Link } from "react-router-dom";
import { BeforeWalletImportNotice } from "../components/BeforeWalletImportNotice";
import { ButtonWithLoader } from "../components/ButtonWithLoader";

export function Profile({
  userAddress,
  isRegistered,
  registerUserHandler,
  tokenBalance,
  mintFakemonHandler,
  getTokenHandler,
  fakemons,
  showLoader,
}) {
  // TODO: Fetch details by address
  const profileDetails = {
    userAddress,
    fakemons: fakemons.length,
    won: 1,
    totalMatches: 4,
    tokenBalance,
    // joinedOn: "09-08-2022",
  };

  const afterWalletImportView = (
    <>
      <Card>
        <Card.Body>
          <Card.Title>User Profile</Card.Title>

          <CardText>
            <strong>Wallet address:</strong> {profileDetails.userAddress}
          </CardText>
          {isRegistered ? (
            <>
              <CardText>
                <strong>No of fakemons:</strong> {profileDetails.fakemons}
              </CardText>
              {/* <CardText>
                <strong>No of battles won:</strong> {profileDetails.won} of{" "}
                {profileDetails.totalMatches}
              </CardText> */}
              <CardText>
                <strong>Token balance:</strong> {profileDetails.tokenBalance}
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
                showLoader={showLoader.mintFakemon}
                size="sm"
                className="mt-2 ms-2"
                onClick={mintFakemonHandler}
              >
                Mint fakemon
              </ButtonWithLoader>

              <Button size="sm" className="mt-2 ms-2" onClick={getTokenHandler}>
                Get token
              </Button>
            </>
          ) : (
            <>
              <CardText>
                <strong>Status:</strong> Unregistered
              </CardText>
              <Button size="sm" className="mt-2" onClick={registerUserHandler}>
                Register now
              </Button>
            </>
          )}
        </Card.Body>
      </Card>

      {/* User squad */}
      {isRegistered && (
        <>
          <h4 className="text-center mt-3 mb-2">Your Squad</h4>
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
      )}
    </>
  );

  return (
    <div style={{ width: "500px", margin: "25px auto" }}>
      {userAddress ? afterWalletImportView : <BeforeWalletImportNotice />}
    </div>
  );
}
