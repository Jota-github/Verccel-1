import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/card";
import { Button } from "../components/button";

export default function Login() {
  const { loginAsAdmin, loginAsUser } = useAuth();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    loginAsAdmin();
    navigate("/admin");
  };

  const handleUserClick = () => {
    loginAsUser();
    navigate("/ponto");
  };

  return (
    <div className="min-h-screen bg-[#003366] flex items-center justify-center p-4">
      <Card>
        <div className="flex flex-col items-center mb-8">
          <img src="/logo-moura.png" alt="Moura" className="h-12 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Acesso Rápido</h2>
          <p className="text-sm text-[#003366] opacity-70">
            Selecione o perfil para acessar o sistema
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Button onClick={handleAdminClick} className="w-full bg-blue-700 text-white">
            ENTRAR COMO ADMIN
          </Button>

          <Button 
            onClick={handleUserClick} 
            className="w-full bg-gray-200 text-[#003366] hover:bg-gray-300"
          >
            ENTRAR COMO USUÁRIO
          </Button>
        </div>
      </Card>
    </div>
  );
}