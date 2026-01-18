import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/card";
import { Button } from "../components/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);
    if (!result.success) {
      alert(result.message);
      return;
    }

    // Redirecionamento por role
    if (user.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/ponto");
    }
  };

  return (
    <div className="min-h-screen bg-[#003366] flex items-center justify-center p-4">
      <Card>
        <div className="flex flex-col items-center mb-8">
          <img src="/logo-moura.png" alt="Moura" className="h-12 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Registros de Ponto</h2>
          <p className="text-sm text-[#003366] opacity-70">
            Faça login para acessar o sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full border rounded-lg p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit">ENTRAR</Button>
        </form>
      </Card>
    </div>
  );
}
