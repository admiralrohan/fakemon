import React from "react";
import { LOCALSTORAGE_KEY } from "../../utils/utils";

export const AuthContext = React.createContext();
AuthContext.displayName = "AuthContext";

function AuthProvider(props) {
  const [walletConnected, setWalletConnected] = React.useState(false);
  /** Will be synced when fetching new blockchain instance. \
   * Using this to avoid calling to whole blockchain instance in components. */
  const [walletAddress, setWalletAddress] = React.useState(null);

  const handleAccountsChanged = React.useRef(() => {
    const savedAddress = window.localStorage.getItem(LOCALSTORAGE_KEY);

    // Will only reload if user changes wallet account while logged in
    if (savedAddress) window.location.reload();
  });
  const handleChainChanged = React.useRef(() => window.location.reload());

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

export default AuthProvider;
