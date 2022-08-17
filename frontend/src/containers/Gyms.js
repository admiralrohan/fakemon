import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export function Gyms() {
  // TODO: Fetch list of gyms from blockchain
  const gymIds = [1, 2, 3];

  return (
    <div style={{ width: 500, margin: "25px auto" }}>
      <Card.Title style={{ marginBottom: 10, textAlign: "center" }}>
        Gym Leaders
      </Card.Title>

      {gymIds.map((gymId) => (
        <Card style={{ width: "500px", marginBottom: 10 }} key={gymId}>
          <Card.Body
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Card.Title>Gym {gymId}</Card.Title>

            <Link to={"/gyms/" + gymId}>
              <Button size="sm">Check your opponent</Button>
            </Link>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
