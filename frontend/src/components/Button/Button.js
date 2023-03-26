import React from "react";
import BsButton from "react-bootstrap/Button";

function Button({ children, ...props }) {
  return <BsButton {...props}>{children}</BsButton>;
}

export default Button;
