import React, { useEffect, useState } from "react";
import { Search, RotateCcw, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";

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
      console.warn("⚠️ Backend offline — usando lista de dados expandida");

      // 🔹 DADOS MOCKADOS PARA SIMULAÇÃO DE LOGIN/LOGOUT
      const mockRecords = [
        {
          id: 1,
          employee: { name: "João Silva" },
          checkinTime: "2026-01-28T08:00:00Z",
          checkoutTime: "2026-01-28T17:00:00Z",
          duration: 540, 
        },
        {
          id: 2,
          employee: { name: "Maria Souza" },
          checkinTime: "2026-01-28T09:15:00Z",
          checkoutTime: "2026-01-28T18:15:00Z",
          duration: 540,
        },
        {
          id: 3,
          employee: { name: "Carlos Oliveira" },
          checkinTime: "2026-01-28T08:30:00Z",
          checkoutTime: null, // Ainda Logado (Trabalhando)
          duration: null,
        },
        {
          id: 4,
          employee: { name: "Ana Costa" },
          checkinTime: "2026-01-27T07:50:00Z",
          checkoutTime: "2026-01-27T16:50:00Z",
          duration: 540,
        },
        {
          id: 5,
          employee: { name: "Abner Santos" },
          checkinTime: "2026-01-28T10:00:00Z",
          checkoutTime: null, // Ainda Logado (Trabalhando)
          duration: null,
        },
        {
          id: 6,
          employee: { name: "Rayssa Ramos" },
          checkinTime: "2026-01-28T08:00:00Z",
          checkoutTime: "2026-01-28T12:00:00Z",
          duration: 240,
        },
        {
          id: 7,
          employee: { name: "Ricardo Lima" },
          checkinTime: "2026-01-27T13:00:00Z",
          checkoutTime: "2026-01-27T22:00:00Z",
          duration: 540,
        }
      ];
      setRecords(mockRecords);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

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
    <div className="min-h-screen bg-[#003366] p-4 md:p-8">
      <header className="bg-white rounded-xl p-4 flex justify-between items-center mb-6 shadow-lg">
        <img src="/logo-moura.png" alt="Moura" className="h-8" />
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-bold"
        >
          <LogOut size={18} /> Sair do Painel
        </button>
      </header>

      <main className="bg-white rounded-2xl p-6 shadow-2xl max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Registros de Atividade</h1>
          <p className="text-gray-500 text-sm">Controle de entrada e saída dos colaboradores</p>
        </div>

        {/* Filtros */}
        <div className="bg-gray-50 p-4 rounded-xl flex flex-wrap gap-4 items-end mb-8 border border-gray-100">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-gray-600 block mb-1">Buscar por Nome</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Nome do colaborador..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Data</label>
            <input
              type="date"
              className="p-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          <button
            onClick={() => { setFilterName(""); setFilterDate(""); }}
            className="flex items-center gap-2 text-gray-500 text-sm hover:text-blue-600 p-2"
          >
            <RotateCcw size={16} /> Resetar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-sm">
                <th className="pb-4 font-semibold uppercase">Colaborador</th>
                <th className="pb-4 font-semibold uppercase">Check-in</th>
                <th className="pb-4 font-semibold uppercase">Check-out</th>
                <th className="pb-4 font-semibold uppercase text-right">Duração</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {filteredRecords.map((reg) => (
                <tr key={reg.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-gray-800">{reg.employee?.name}</div>
                    <div className="text-xs text-gray-400">ID: #{reg.id}</div>
                  </td>
                  <td className="py-4 text-sm">
                    {new Date(reg.checkinTime).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-4 text-sm">
                    {reg.checkoutTime ? (
                      new Date(reg.checkoutTime).toLocaleString('pt-BR')
                    ) : (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        EM JORNADA
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right font-bold text-[#003366]">
                    {reg.duration
                      ? `${Math.floor(reg.duration / 60)}h ${reg.duration % 60}min`
                      : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Nenhum registro encontrado para os filtros selecionados.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}