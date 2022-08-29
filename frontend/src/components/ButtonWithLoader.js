import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

/**
 * Will show spinner and disable the button while `showLoader` is true \
 * All APIs are same as React bootstrap
 */
export function ButtonWithLoader({
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
