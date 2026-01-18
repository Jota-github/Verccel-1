import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <header className="bg-white rounded-xl p-4 flex justify-between items-center mb-6 shadow-lg">
      <img src="/logo-moura.png" alt="Moura" className="h-8" />
      <button 
        onClick={logout} 
        className="flex items-center gap-2 text-gray-600 hover:text-moura-blue transition-colors font-medium"
      >
        <LogOut size={18} /> Sair
      </button>
    </header>
  );
}