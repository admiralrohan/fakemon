import React from "react";
import * as Toast from "@radix-ui/react-toast";
import styled from "@emotion/styled";

export const ToastContext = React.createContext();
ToastContext.displayName = "ToastContext";

function ToastProvider({ children, ...props }) {
  // Old toasts will automatically be removed from DOM by Radix component. But data will stay in this array. No issues as it will not grow too large. It won't clog up the memory. On page they will be gone.
  const [toasts, setToasts] = React.useState([]);

  const showToast = (message) => {
    const newToast = { id: crypto.randomUUID(), message };
    setToasts([...toasts, newToast]);
  };

  const exportedMembers = { toasts, showToast };

  return (
    <ToastContext.Provider value={exportedMembers} {...props}>
      <Toast.Provider duration={4000}>
        {children}
        <ToastViewport />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

const ToastViewport = styled(Toast.Viewport)`
  position: fixed;
  bottom: 16px;
  right: 16px;
  margin: 0;
  padding: 0;
  list-style-type: none;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default ToastProvider;
