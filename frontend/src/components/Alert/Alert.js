import styled from "@emotion/styled";
import React from "react";

/** Will use whenever we need to show some alert message for user */
function Alert({ children = "Some error happened" }) {
  return <Wrapper>{children}</Wrapper>;
}

const Wrapper = styled.div`
  border: 1px solid;
  padding: 8px 16px;
  display: flex;
  justify-content: center;
`;

export default Alert;
