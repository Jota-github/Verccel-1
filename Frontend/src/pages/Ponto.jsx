import React, { useState } from "react";
import { Clock, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import { Card } from "../components/card";
import { Button } from "../components/button";

export default function Ponto() {
  const { user, logout } = useAuth();

  const [status, setStatus] = useState("idle"); // idle | active | finished
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!user) return;

    setLoading(true);

    const endpoint =
      status === "idle" ? "/work/checkin" : "/work/checkout";

    try {
      const response = await api.post(
        `${endpoint}?employeeId=${user.id}`
      );

      setRecord(response.data);
      setStatus(status === "idle" ? "active" : "finished");
    } catch (error) {
      console.warn("⚠️ Backend offline — calculando duração mockada em tempo real");

      const now = new Date();

      if (status === "idle") {
        // Primeiro clique: Armazena o horário de entrada real
        setRecord({
          checkinTime: now.toISOString(),
        });
        setStatus("active");
      } else {
        // Segundo clique: Calcula a diferença real entre entrada e agora
        const checkinDate = new Date(record.checkinTime);
        const diffInMs = now - checkinDate;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

        setRecord({
          ...record,
          checkoutTime: now.toISOString(),
          duration: diffInMinutes > 0 ? diffInMinutes : 1, // Garante pelo menos 1min para o teste
        });
        setStatus("finished");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-moura-blue flex items-center justify-center p-4">
      <Card className="text-center w-full max-w-[400px]">
        <img
          src="/logo-moura.png"
          alt="Moura"
          className="h-10 mx-auto mb-6"
        />

        <h2 className="text-xl font-bold mb-1 text-gray-800 italic">
          Registro de Ponto
        </h2>

        {/* IDLE */}
        {status === "idle" && (
          <>
            <p className="text-gray-500 mb-8 text-sm">
              Seja bem-vindo,{" "}
              <span className="font-bold text-moura-blue">
                {user?.name}
              </span>
            </p>

            <Button
              onClick={handleAction}
              icon={Clock}
              disabled={loading}
            >
              {loading ? "Processando..." : "Realizar Check-in"}
            </Button>
          </>
        )}

        {/* ACTIVE */}
        {status === "active" && (
          <>
            <p className="text-gray-500 mb-4 text-xs font-medium italic">
              {user?.name}, seu check-in foi realizado às
            </p>

            <div className="text-5xl font-bold text-moura-orange mb-8 italic tracking-tight">
              {new Date(record?.checkinTime).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}
            </div>

            <Button
              onClick={handleAction}
              icon={Clock}
              disabled={loading}
              className="bg-moura-orange hover:bg-orange-600"
            >
              {loading ? "Processando..." : "Realizar Check-out"}
            </Button>
          </>
        )}

        {/* FINISHED */}
        {status === "finished" && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <p className="text-moura-blue font-bold italic">
              Checkout realizado com sucesso!
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase font-bold">
                  Entrada
                </p>
                <p className="font-bold text-gray-800">
                  {new Date(
                    record?.checkinTime
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase font-bold">
                  Saída
                </p>
                <p className="font-bold text-gray-800">
                  {new Date(
                    record?.checkoutTime
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
              <p className="text-[10px] text-orange-400 uppercase font-black">
                Total trabalhado na sessão
              </p>
              <p className="text-3xl font-black text-moura-orange">
                {Math.floor((record?.duration || 0) / 60)}h {(record?.duration || 0) % 60}min
              </p>
            </div>

            <Button 
                onClick={() => setStatus("idle")} 
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
                Novo Registro
            </Button>
          </div>
        )}

        <button
          onClick={logout}
          className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-xs hover:text-moura-blue transition-colors w-full"
        >
          <LogOut size={14} /> Encerrar Sessão
        </button>
      </Card>
    </div>
  );
}