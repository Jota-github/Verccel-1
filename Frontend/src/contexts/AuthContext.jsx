import React, { createContext, useContext, useState } from "react";
import api from "../api/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Função para entrar como Admin direto
  const loginAsAdmin = () => {
    const adminUser = {
      id: 1,
      name: "Admin Moura",
      role: "ADMIN",
      token: "fake-admin-token",
    };
    setUser(adminUser);
    // Configura o token na API caso precise buscar dados
    api.defaults.headers.common["Authorization"] = `Bearer ${adminUser.token}`;
  };

  // Função para entrar como Usuário direto
  const loginAsUser = () => {
    const normalUser = {
      id: 2,
      name: "Funcionário Moura",
      role: "USER",
      token: "fake-user-token",
    };
    setUser(normalUser);
    api.defaults.headers.common["Authorization"] = `Bearer ${normalUser.token}`;
  };

  const logout = () => {
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        loginAsAdmin,
        loginAsUser,
        authenticated: !!user,
        isAdmin: user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);