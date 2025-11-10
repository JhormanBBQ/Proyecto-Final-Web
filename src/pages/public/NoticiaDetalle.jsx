import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";

export default function NoticiaDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNoticia = async () => {
      const docRef = doc(db, "noticias", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNoticia(docSnap.data());
      } else {
        navigate("/404");
      }
    };
    fetchNoticia();
  }, [id, navigate]);

  if (!noticia) return <p className="text-center mt-20 text-white">Cargando...</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-400 hover:underline"
      >
        ← Volver
      </button>

      <h1 className="text-3xl font-bold mb-4">{noticia.titulo}</h1>
      <p className="text-sm text-gray-400 mb-6">
        Publicado por {noticia.autorNombre || "Desconocido"}
      </p>

      <div className="bg-slate-800 p-6 rounded-lg">
        <p className="text-lg leading-relaxed">{noticia.contenido}</p>
      </div>
    </div>
  );
}
