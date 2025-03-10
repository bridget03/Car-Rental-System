"use client";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  loginState: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [loginState, setLoginState] = useState(false);

  const login = () => {
    setLoginState(true);
    console.log("Login successful");
  };
  const logout = () => {
    setLoginState(false);
    console.log("Logout successful");
  };

  return (
    <AuthContext.Provider value={{ loginState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
