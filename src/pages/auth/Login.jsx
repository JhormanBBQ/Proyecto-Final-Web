import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Credenciales incorrectas o usuario no registrado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-public bg-cover bg-center flex items-center justify-center relative overflow-hidden">
      {/* 🔹 Capa de desenfoque con oscurecimiento */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 backdrop-blur-sm" />

      {/* 🔹 Tarjeta de login */}
      <div className="relative z-10 bg-slate-800/70 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 text-white">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-blue-400">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo"
              className="bg-slate-900/70 border border-slate-700 focus:ring-2 focus:ring-blue-500 w-full rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-slate-900/70 border border-slate-700 focus:ring-2 focus:ring-blue-500 w-full rounded-lg p-2"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4 text-sm">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
