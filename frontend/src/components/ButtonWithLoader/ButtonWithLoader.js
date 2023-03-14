import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

/**
 * We want to show why the button is disabled in tooltip. \
 * This component is a wrapper of bootstrap button component. \
 * It is needed to show the tooltip, which is not visible for disabled buttons. \
 * Will show spinner and disable the button while `showLoader` is true. \
 * All APIs are same as React bootstrap.
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
    <span title={showLoader ? null : title}>
      <Button
        size={size}
        className={className}
        onClick={onClick}
        disabled={disabled || showLoader}
      >
        {showLoader && (
          <Spinner animation="border" size="sm" className="me-1" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {children}
      </Button>
    </span>
  );
}

export default ButtonWithLoader;
