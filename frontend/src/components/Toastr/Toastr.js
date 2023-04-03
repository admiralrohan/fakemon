import React from "react";
import * as Toast from "@radix-ui/react-toast";
import useToast from "../../hooks/useToast";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

function Toastr() {
  const { toasts } = useToast();

  return toasts.map((toast, i) => (
    <ToastRoot key={toast.id}>
      <ToastMessage>{toast.message}</ToastMessage>
      <CloseButton aria-label="Close">
        <span aria-hidden>x</span>
      </CloseButton>
    </ToastRoot>
  ));
}

const Animation = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0%);
  }
`;

const ToastRoot = styled(Toast.Root)`
  display: flex;
  justify-content: space-between;
  gap: 4px;

  border: 1px solid black;
  padding: 8px 12px;
  width: 250px;

  animation: ${Animation} 250ms linear;
`;
const ToastMessage = styled(Toast.Description)``;
const CloseButton = styled(Toast.Close)`
  align-self: flex-start;
  transform: translateY(1px); // Aligned with eye, no particular logic

  & > span {
    display: block; // To apply transform
    line-height: 1; // To remove space below the cross icon, turning the shape into rectangle
    transform: translateY(-2px);
  }
`;

export default Toastr;
