import { createContext, useContext, useRef, useState } from "react";

const AuthContext = createContext();
AuthContext.displayName = "AuthContext";

export function AuthProvider(props) {
  const [walletConnected, setWalletConnected] = useState(false);
  /** Will be synced when fetching new blockchain instance. \
   * Using this to avoid calling to whole blockchain instance in components. */
  const [walletAddress, setWalletAddress] = useState(null);

  const handleAccountsChanged = useRef(() => window.location.reload());
  const handleChainChanged = useRef(() => window.location.reload());

  const exportedMembers = {
    walletConnected,
    setWalletAddress,
    walletAddress,
    setWalletConnected,
    handleAccountsChanged: handleAccountsChanged.current,
    handleChainChanged: handleChainChanged.current,
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
