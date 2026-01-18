import React, { useEffect, useState } from "react";
import { Search, RotateCcw, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import { Button } from "../components/button";

export default function Admin() {
  const { logout } = useAuth();

  const [records, setRecords] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchRecords = async () => {
    try {
      const response = await api.get("/work/list");
      setRecords(response.data);
    } catch (error) {
      console.warn("⚠️ Backend offline — usando dados mockados");

      // 🔹 DADOS MOCKADOS PARA DESENVOLVIMENTO
      setRecords([
        {
          id: 1,
          employee: { name: "João Silva" },
          checkinTime: new Date().toISOString(),
          checkoutTime: new Date().toISOString(),
          duration: 480,
        },
        {
          id: 2,
          employee: { name: "Maria Souza" },
          checkinTime: new Date().toISOString(),
          checkoutTime: null,
          duration: null,
        },
      ]);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // 🔍 Filtros locais (frontend)
  const filteredRecords = records.filter((reg) => {
    const matchesName = reg.employee?.name
      ?.toLowerCase()
      .includes(filterName.toLowerCase());

    const matchesDate = filterDate
      ? new Date(reg.checkinTime).toISOString().slice(0, 10) === filterDate
      : true;

    return matchesName && matchesDate;
  });

  return (
    <div className="min-h-screen bg-moura-blue p-4 md:p-8">
      {/* Header */}
      <header className="bg-white rounded-xl p-4 flex justify-between items-center mb-6 shadow-lg">
        <img src="/logo-moura.png" alt="Moura" className="h-8" />
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-600 hover:text-moura-blue"
        >
          <LogOut size={18} /> Sair
        </button>
      </header>

      <main className="bg-white rounded-2xl p-6 shadow-2xl max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Painel Administrativo
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Visualize e filtre os registros dos funcionários
        </p>

        {/* Filtros */}
        <div className="bg-gray-100 p-4 rounded-xl flex flex-wrap gap-4 items-end mb-8">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Nome
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Filtrar por nome"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Data
            </label>
            <input
              type="date"
              className="p-2 rounded-lg border border-gray-300"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          <Button className="w-auto px-8 py-2">Filtrar</Button>

          <button
            onClick={() => {
              setFilterName("");
              setFilterDate("");
            }}
            className="flex items-center gap-2 text-gray-500 text-sm hover:text-moura-blue p-2"
          >
            <RotateCcw size={16} /> Limpar
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-400 text-sm">
                <th className="pb-4 font-medium">Funcionário</th>
                <th className="pb-4 font-medium">Check-in</th>
                <th className="pb-4 font-medium">Check-out</th>
                <th className="pb-4 font-medium text-right">Duração</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {filteredRecords.map((reg) => (
                <tr key={reg.id} className="border-b last:border-0">
                  <td className="py-4 font-bold">
                    {reg.employee?.name || "---"}
                  </td>
                  <td className="py-4 text-sm">
                    {new Date(reg.checkinTime).toLocaleString()}
                  </td>
                  <td className="py-4 text-sm">
                    {reg.checkoutTime
                      ? new Date(reg.checkoutTime).toLocaleString()
                      : "---"}
                  </td>
                  <td className="py-4 text-right font-bold text-moura-orange">
                    {reg.duration
                      ? `${Math.floor(reg.duration / 60)}h ${
                          reg.duration % 60
                        }min`
                      : "--"}
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-400 py-8"
                  >
                    Nenhum registro encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
