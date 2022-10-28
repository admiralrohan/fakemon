import { createContext, useContext } from "react";

const AuthContext = createContext();
AuthContext.displayName = "AuthContext";

export function AuthProvider(props) {
  const value = { hi: true };

  return <AuthContext.Provider value={value} {...props} />;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}
