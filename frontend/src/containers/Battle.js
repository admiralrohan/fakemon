import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export function Battle() {
  const gymId = 1;
  // TODO: Fetch squad from blockchain
  const userSquad = [1, 2, 3];
  // TODO: Send squad from previous page
  const gymSquad = [1, 2, 3];

  return (
    <div style={{ width: 500, margin: "25px auto" }}>
      <Card.Title style={{ marginBottom: 10, textAlign: "center" }}>
        Battle with Gym #{gymId}
      </Card.Title>

      <Card.Subtitle style={{ marginBottom: 10, textAlign: "center" }}>
        Your squad
      </Card.Subtitle>

      {userSquad.map((gymId) => (
        <Card style={{ width: "500px", marginBottom: 10 }} key={gymId}>
          <Card.Body
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Card.Title>Fakemon {gymId}</Card.Title>

            <Link to={"/gyms/" + gymId}>
              <Button size="sm">Use</Button>
            </Link>
          </Card.Body>
        </Card>
      ))}

      <Card.Subtitle
        style={{ marginTop: 20, marginBottom: 10, textAlign: "center" }}
      >
        Gym squad
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
      <Link to={`/gyms/${gymId}/battle`}>
        <Button>Flee</Button>
      </Link>
    </div>
  );
}
