// src/components/Header.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // No mostrar header si no hay sesión

  const handleLogout = async () => {
    await logout();
    navigate("/"); // 👈 Redirige manualmente al muro de noticias
  };

  return (
    <header className="w-full bg-slate-800 text-white p-4 flex justify-between items-center shadow-md fixed top-0 left-0 z-50">
      <h1
        onClick={() => navigate("/admin")}
        className="font-bold text-lg cursor-pointer"
      >
        📰 Portal de Noticias
      </h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300 hidden sm:block">
          Hola, {user.displayName || "Usuario"} 👋
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
