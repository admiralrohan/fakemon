import Card from "react-bootstrap/Card";

/** Will use whenever we need to show some alert message for user */
export function AlertLayout({ content = "Some error happened" }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Subtitle className="text-center">{content}</Card.Subtitle>
      </Card.Body>
    </Card>
  );
}
