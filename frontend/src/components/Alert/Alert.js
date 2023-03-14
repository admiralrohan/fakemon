import React from "react";
import Card from "react-bootstrap/Card";

/** Will use whenever we need to show some alert message for user */
function Alert({ children = "Some error happened" }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Subtitle className="text-center">{children}</Card.Subtitle>
      </Card.Body>
    </Card>
  );
}

export default Alert;
