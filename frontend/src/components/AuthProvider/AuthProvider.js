import React from "react";

export const AuthContext = React.createContext();
AuthContext.displayName = "AuthContext";

function AuthProvider(props) {
  const [walletConnected, setWalletConnected] = React.useState(false);
  /** Will be synced when fetching new blockchain instance. \
   * Using this to avoid calling to whole blockchain instance in components. */
  const [walletAddress, setWalletAddress] = React.useState(null);

  const handleAccountsChanged = React.useRef(() => {
    // When connecting to wallet for first time, this function is getting triggered before it has chance to save `signerAddress` in localStorage. So after the page reload it's not automatically connecting to wallet. Leading to bad UX.
    setTimeout(() => {
      window.location.reload();
    }, 100);
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
