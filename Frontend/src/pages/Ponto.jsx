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
      console.warn("⚠️ Backend offline — usando dados mockados");

      // 🔹 MOCK PARA DESENVOLVIMENTO
      const now = new Date();

      const mockRecord =
        status === "idle"
          ? {
              checkinTime: now.toISOString(),
            }
          : {
              checkinTime:
                record?.checkinTime || now.toISOString(),
              checkoutTime: now.toISOString(),
              duration: 480,
            };

      setRecord(mockRecord);
      setStatus(status === "idle" ? "active" : "finished");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-moura-blue flex items-center justify-center p-4">
      <Card className="text-center">
        <img
          src="/logo-moura.png"
          alt="Moura"
          className="h-10 mx-auto mb-6"
        />

        <h2 className="text-xl font-bold mb-1 text-gray-800">
          Registro de Ponto
        </h2>

        {/* IDLE */}
        {status === "idle" && (
          <>
            <p className="text-gray-500 mb-8 text-sm">
              Seja bem-vindo,{" "}
              <span className="font-bold">
                {user?.name}
              </span>
              .
            </p>

            <Button
              onClick={handleAction}
              icon={Clock}
              disabled={loading}
            >
              {loading ? "Processando..." : "Check-in"}
            </Button>
          </>
        )}

        {/* ACTIVE */}
        {status === "active" && (
          <>
            <p className="text-gray-500 mb-4 text-xs font-medium italic">
              {user?.name}, seu check-in foi realizado às
            </p>

            <div className="text-5xl font-bold text-moura-orange mb-8 italic">
              {new Date(record?.checkinTime).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}
            </div>

            <Button
              onClick={handleAction}
              icon={Clock}
              disabled={loading}
            >
              {loading ? "Processando..." : "Check-out"}
            </Button>
          </>
        )}

        {/* FINISHED */}
        {status === "finished" && (
          <div className="space-y-4">
            <p className="text-moura-blue font-medium italic">
              Seu checkout foi realizado!
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 p-2 rounded-lg">
                <p className="text-[10px] text-gray-400">
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

              <div className="bg-gray-100 p-2 rounded-lg">
                <p className="text-[10px] text-gray-400">
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

            <div className="bg-orange-50 p-4 rounded-xl">
              <p className="text-[10px] text-gray-400 uppercase font-bold">
                Total trabalhado hoje
              </p>
              <p className="text-2xl font-bold text-moura-orange">
                {Math.floor(
                  (record?.duration || 0) / 60
                )}
                h {(record?.duration || 0) % 60}min
              </p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-xs hover:underline w-full"
        >
          <LogOut size={14} /> Sair
        </button>
      </Card>
    </div>
  );
}
