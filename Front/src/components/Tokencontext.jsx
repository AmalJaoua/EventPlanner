import React, { createContext, useState } from "react";

// Create the context
export const TokenContext = createContext();

// Create a provider component
export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Update the token and sync it with localStorage
  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  return (
    <TokenContext.Provider value={{ token, updateToken }}>
      {children}
    </TokenContext.Provider>
  );
};