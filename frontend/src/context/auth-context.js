import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
AuthContext.displayName = "AuthContext";

export function AuthProvider(props) {
  const [walletConnected, setWalletConnected] = useState(false);
  /** Will be synced when fetching new blockchain instance. \
   * Using this to avoid calling to whole blockchain instance in components. */
  const [walletAddress, setWalletAddress] = useState(null);

  const exportedMembers = {
    walletConnected,
    setWalletAddress,
    walletAddress,
    setWalletConnected,
  };

  return <AuthContext.Provider value={exportedMembers} {...props} />;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}
