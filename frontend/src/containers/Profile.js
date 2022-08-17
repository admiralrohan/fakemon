import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { CardText } from "../utils/utils";
import { Link } from "react-router-dom";

export function Profile({
  blockchain,
  isRegistered,
  registerUser,
  tokenBalance,
}) {
  // TODO: Ask user to connect wallet if no address

  // TODO: Fetch details by address
  const profileDetails = {
    address: blockchain.signerAddress,
    fakemons: 1,
    won: 1,
    totalMatches: 4,
    tokenBalance,
    joinedOn: "09-08-2022",
  };
  const gymSquad = [1, 2, 3];

  const beforeWalletImportView = (
    <Card>
      <Card.Body>
        <Card.Subtitle className="text-center">
          Import your wallet to see profile details
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );

  const afterWalletImportView = (
    <>
      <Card>
        <Card.Body>
          <Card.Title>User Profile</Card.Title>

          <CardText>
            <strong>Wallet address:</strong> {profileDetails.address}
          </CardText>
          {isRegistered ? (
            <>
              <CardText>
                <strong>No of fakemons:</strong> {profileDetails.fakemons}
              </CardText>
              <CardText>
                <strong>No of battles won:</strong> {profileDetails.won} of{" "}
                {profileDetails.totalMatches}
              </CardText>
              <CardText>
                <strong>Token balance:</strong> {profileDetails.tokenBalance}
              </CardText>
              {/* <CardText>
                <strong>Joined on:</strong> {profileDetails.joinedOn}
              </CardText> */}
            </>
          ) : (
            <>
              <CardText>
                <strong>Status:</strong> Unregistered
              </CardText>
              <Button size="sm" className="mt-2" onClick={registerUser}>
                Register now
              </Button>
            </>
          )}

          {/* <Link to="/gyms">
            <Button size="sm" className="mt-2">
              Battle now
            </Button>
          </Link> */}
        </Card.Body>
      </Card>

      <h4 className="text-center mt-3 mb-2">Your Squad</h4>
      {gymSquad.map((gymId) => (
        <Card style={{ width: "500px", marginBottom: 10 }} key={gymId}>
          <Card.Body className="d-flex justify-content-between align-items-baseline">
            <Card.Title>Fakemon {gymId}</Card.Title>
          </Card.Body>
        </Card>
      ))}
    </>
  );

  return (
    <div style={{ width: "500px", margin: "25px auto" }}>
      {profileDetails.address ? afterWalletImportView : beforeWalletImportView}
    </div>
  );
}
