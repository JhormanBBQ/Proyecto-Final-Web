// src/pages/public/Home.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const q = query(collection(db, "noticias"), where("estado", "==", "Publicado"));
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNoticias(data);
      } catch (error) {
        console.error("Error al obtener noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  if (loading)
    return <p className="text-center mt-20 text-white">Cargando noticias...</p>;

  return (
    <div className="min-h-screen bg-public bg-cover bg-center bg-fixed text-white p-8">
      {/* Encabezado principal */}
      <div className="text-center mb-10">
        <h1 className="text-5xl sm:text-6xl font-extrabold drop-shadow-lg">
          📰 <span className="text-white">Portal</span>{" "}
          <span className="text-blue-400">de Noticias</span>
        </h1>
        <p className="mt-3 text-gray-300 text-lg">
          Noticias publicadas por la comunidad
        </p>

        <a
          href="/login"
          className="inline-block mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
        >
          Ir al Login
        </a>
      </div>

      {/* Noticias publicadas */}
      {noticias.length === 0 ? (
        <p className="text-center text-gray-400">No hay noticias publicadas.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((n) => (
            <div
              key={n.id}
              className="bg-slate-800/80 backdrop-blur-md p-6 rounded-xl shadow-md hover:shadow-blue-500/20 cursor-pointer transition"
              onClick={() => navigate(`/noticia/${n.id}`)}
            >
              <h2 className="text-xl font-bold mb-2 text-white">
                {n.titulo}
              </h2>
              <p className="text-sm text-gray-300 line-clamp-3">{n.contenido}</p>
              <p className="text-xs text-gray-400 mt-3">
                Autor: {n.autorNombre || "Desconocido"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
