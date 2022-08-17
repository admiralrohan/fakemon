import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export function Gym({ blockchain }) {
  // TODO: Fetch squad from blockchain
  const gymSquad = [1, 2, 3];
  // TODO: Fetch from url param
  const gymId = 1;
  const gymOwner = "0x8efa3761a2e62c22067b87b7f722f4b6e12b63f8";

  return (
    <div style={{ width: 500, margin: "25px auto" }}>
      <Card.Title style={{ marginBottom: 10, textAlign: "center" }}>
        Gym #{gymId}
      </Card.Title>
      <Card.Subtitle style={{ marginBottom: 20, textAlign: "center" }}>
        Owner {gymOwner}
      </Card.Subtitle>

      {gymSquad.map((gymId) => (
        <Card style={{ width: "500px", marginBottom: 10 }} key={gymId}>
          <Card.Body
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Card.Title>Fakemon {gymId}</Card.Title>
          </Card.Body>
        </Card>
      ))}

      <Link to={`/gyms/${gymId}/battle`}>
        <Button>Battle</Button>
      </Link>
    </div>
  );
}
