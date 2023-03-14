import React from "react";
import { ToastContext } from "../components/ToastProvider";

function useToast() {
  const context = React.useContext(ToastContext);

  if (context === undefined) {
    throw new Error(`useToast must be used within a ToastProvider`);
  }

  return context;
}

export default useToast;
