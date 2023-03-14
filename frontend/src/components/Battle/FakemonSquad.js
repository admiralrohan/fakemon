import React from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { useAttackFakemon } from "../../hooks/mutations";
import ButtonWithLoader from "../ButtonWithLoader";

function FakemonSquad({
  fakemon,
  showUseButton = false,
  selectedFakemon,
  setSelectedFakemon,
}) {
  const { isLoading: isAttackFakemonLoading } = useAttackFakemon();

  return (
    <Card className="mb-2" style={{ width: "500px" }}>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-baseline">
          Fakemon #{fakemon.id}
          {fakemon.hp === "0" && <Badge bg="danger">Fainted</Badge>}
        </Card.Title>

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

          {showUseButton && (
            <div>
              {!selectedFakemon && (
                <ButtonWithLoader
                  size="sm"
                  className="text-end"
                  disabled={fakemon.hp === "0" || isAttackFakemonLoading}
                  title={fakemon.hp === "0" ? "Don't have HP to fight" : null}
                  onClick={() => setSelectedFakemon(fakemon.id)}
                >
                  Use
                </ButtonWithLoader>
              )}

              {selectedFakemon === fakemon.id && (
                <ButtonWithLoader
                  size="sm"
                  className="text-end"
                  onClick={() => setSelectedFakemon(null)}
                >
                  De-select
                </ButtonWithLoader>
              )}
            </div>
          )}
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
}

export default FakemonSquad;
