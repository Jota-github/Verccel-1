import React, { createContext, useContext, useState } from "react";
import api from "../api/api";

const AuthContext = createContext({});

const DEV_MODE = true; // troque para false quando backend entrar

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // ======================
    // 🔧 MODO DESENVOLVIMENTO
    // ======================
    if (DEV_MODE) {
      // usuários fake
      const fakeUsers = [
        {
          id: 1,
          name: "Admin Moura",
          email: "admin@moura.com",
          password: "123456",
          role: "ADMIN",
          token: "fake-admin-token",
        },
        {
          id: 2,
          name: "Funcionário Moura",
          email: "user@moura.com",
          password: "123456",
          role: "USER",
          token: "fake-user-token",
        },
      ];

      const foundUser = fakeUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        return {
          success: false,
          message: "Email ou senha inválidos",
        };
      }

      setUser(foundUser);
      return { success: true, user: foundUser };
    }

    // ======================
    // 🚀 MODO PRODUÇÃO
    // ======================
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      setUser(response.data);

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      return { success: true, user: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Erro ao realizar login",
      };
    }
  };

  const logout = () => {
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        authenticated: !!user,
        isAdmin: user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
