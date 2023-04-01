import React from "react";
import Button from "../Button";
import Spinner from "../Spinner/Spinner";
import styled from "@emotion/styled";

/**
 * We want to show why the button is disabled in tooltip. \
 * This component is a wrapper of our `Button` component. \
 * It is needed to show the tooltip, which is not visible for disabled buttons. \
 * Will show spinner and disable the button while `showLoader` is true.
 */
function ButtonWithLoader({
  children = "",
  showLoader = false,
  size = "",
  className = "",
  disabled = false,
  title = null,
  onClick = () => {},
}) {
  return (
    // Used span for tooltip as it would not work for disabled buttons
    <span title={showLoader ? null : title} className={className}>
      <ButtonWrapper
        size={size}
        onClick={onClick}
        disabled={disabled || showLoader}
      >
        {showLoader && <Loader />}
        {children}
      </ButtonWrapper>
    </span>
  );
}

const ButtonWrapper = styled(Button)`
  display: flex;
  align-items: center;
`;
const Loader = styled(Spinner)`
  margin-right: 0.25rem;
`;

export default ButtonWithLoader;
