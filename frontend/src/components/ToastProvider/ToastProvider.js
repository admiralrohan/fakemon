import React from "react";

export const ToastContext = React.createContext();
ToastContext.displayName = "ToastContext";

function ToastProvider(props) {
  // To trigger toast showing for 2s
  const [toastCount, setToastCount] = React.useState(0);
  const [toastMessage, setToastMessage] = React.useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastCount((curr) => curr + 1);
  };

  const exportedMembers = { toastCount, toastMessage, showToast };

  return <ToastContext.Provider value={exportedMembers} {...props} />;
}

export default ToastProvider;
