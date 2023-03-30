import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import Button from "../Button";

function ActionButtons({ gymId, isOwnGym, noOfFakemons }) {
  /** Can't battle with own gym */
  const preventBattle = isOwnGym || noOfFakemons === 0;
  const reasonForPreventBattle =
    noOfFakemons === 0
      ? "Reload page"
      : isOwnGym
      ? "You can't battle against your own gym"
      : null;

  return (
    <Wrapper>
      <Button as={Link} size="sm" to="/gyms">
        Back
      </Button>

      <span title={reasonForPreventBattle}>
        <Button
          as={Link}
          to={`/gyms/${gymId}/battle`}
          size="sm"
          style={{
            pointerEvents: preventBattle ? "none" : "auto",
            opacity: preventBattle ? 0.65 : 1,
          }}
        >
          Battle
        </Button>
      </span>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

export default ActionButtons;
