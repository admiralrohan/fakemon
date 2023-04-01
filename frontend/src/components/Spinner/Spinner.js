import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import VisuallyHidden from "../VisuallyHidden/VisuallyHidden";

// Source: https://loading.io/css/
function Spinner({ className }) {
  return (
    <Wrapper role="status" className={className}>
      <VisuallyHidden>Loading...</VisuallyHidden>
    </Wrapper>
  );
}

const Animation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Wrapper = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  display: grid;
  place-content: center;

  &:after {
    content: " ";
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 3px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: ${Animation} 1.2s linear infinite;
  }
`;

export default Spinner;
