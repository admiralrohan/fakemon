import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import useAuth from "../../hooks/useAuth";
import useGyms from "../../hooks/useGyms";
import styled from "@emotion/styled";

function GymList() {
  const { walletAddress } = useAuth();
  const { data: gyms } = useGyms();

  return (
    <Wrapper>
      {gyms.map((gym) => (
        <Card className="mb-2" style={{ width: "500px" }} key={gym.id}>
          <Card.Body className="d-flex justify-content-between">
            <Card.Title>
              Gym #{gym.id}{" "}
              {gym.owner === walletAddress && (
                <span className="fs-6">(Mine)</span>
              )}
            </Card.Title>

            <Link to={"/gyms/" + gym.id}>
              <Button size="sm">Check squad</Button>
            </Link>
          </Card.Body>
        </Card>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.section``;

export default GymList;
