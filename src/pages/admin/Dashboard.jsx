// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../../services/firebaseConfig";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUsuario(data);

        const noticiasRef = collection(db, "noticias");
        let q;
        if (data.rol === "reportero") {
          q = query(noticiasRef, where("autorId", "==", user.uid));
        } else {
          q = query(noticiasRef);
        }
        const snap = await getDocs(q);
        setNoticias(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }

      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  if (loading)
    return <p className="text-center mt-20 text-white">Cargando...</p>;

  return (
    <div className="min-h-screen bg-private bg-cover bg-center bg-fixed relative overflow-hidden">
      {/* 🔹 Capa translúcida */}
      <div className="absolute inset-0 bg-overlay" />

      {/* 🔹 Contenido principal */}
      <div className="relative z-10 p-8 text-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
            🛠️ Panel de <span className="text-blue-400">Administración</span>
          </h1>

          <p className="mb-6 text-gray-200 text-lg">
            Bienvenido <span className="font-semibold text-white">{usuario?.nombre}</span> 👋
            <br />
            <span className="text-gray-400 text-base">
              Rol: <span className="text-green-400">{usuario?.rol}</span>
            </span>
          </p>

          {/* Botón Nueva Noticia */}
          <button
            onClick={() => navigate("/admin/nueva-noticia")}
            className="bg-green-600 hover:bg-green-700 transition-all duration-300 px-5 py-2 rounded-lg font-semibold mb-8 shadow-lg hover:shadow-green-500/20"
          >
            + Nueva Noticia
          </button>

          {/* Listado de noticias */}
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2">
            📰 Tus noticias
          </h2>

          {noticias.length === 0 ? (
            <p className="text-gray-300 italic">
              Aún no tienes noticias registradas.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticias.map((n) => (
                <div
                  key={n.id}
                  className="bg-slate-800/80 backdrop-blur-md p-5 rounded-xl shadow-md hover:shadow-blue-500/20 border border-slate-700/60 transition transform hover:-translate-y-1"
                >
                  <h3 className="text-xl font-semibold mb-1 text-white">
                    {n.titulo}
                  </h3>
                  <p className="text-sm text-gray-300 mb-2 line-clamp-3">
                    {n.subtitulo || n.contenido?.slice(0, 80) + "..."}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-400 mt-3">
                    <span className="capitalize">
                      Estado:{" "}
                      <span
                        className={`font-semibold ${
                          n.estado === "Publicado"
                            ? "text-green-400"
                            : n.estado === "Edición"
                            ? "text-yellow-400"
                            : n.estado === "Revisión"
                            ? "text-blue-400"
                            : "text-red-400"
                        }`}
                      >
                        {n.estado}
                      </span>
                    </span>

                    <button
                      onClick={() => navigate(`/admin/editar/${n.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-white text-sm font-semibold shadow hover:shadow-blue-500/30"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
