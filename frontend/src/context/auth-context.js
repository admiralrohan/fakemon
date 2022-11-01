import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
AuthContext.displayName = "AuthContext";

export function AuthProvider(props) {
  const [walletConnected, setWalletConnected] = useState(false);

  return (
    <AuthContext.Provider
      value={[walletConnected, setWalletConnected]}
      {...props}
    />
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}
