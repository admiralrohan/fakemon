import { createContext, useContext, useState } from "react";

const ToastContext = createContext();
ToastContext.displayName = "ToastContext";

export function ToastProvider(props) {
  // To trigger toast showing for 2s
  const [toastCount, setToastCount] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastCount((curr) => curr + 1);
  };

  const exportedMembers = { toastCount, toastMessage, showToast };

  return <ToastContext.Provider value={exportedMembers} {...props} />;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error(`useToast must be used within a ToastProvider`);
  }
  return context;
}
