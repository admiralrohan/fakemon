import Card from "react-bootstrap/Card";

export function BeforeWalletImportNotice() {
  return (
    <Card>
      <Card.Body>
        <Card.Subtitle className="text-center">
          Import your wallet to see details
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
}
