// src/pages/admin/EditarNoticia.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../../services/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditarNoticia() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [noticia, setNoticia] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estado, setEstado] = useState("");
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Cargar la noticia actual
  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const docRef = doc(db, "noticias", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNoticia(data);
          setTitulo(data.titulo);
          setSubtitulo(data.subtitulo);
          setContenido(data.contenido);
          setCategoria(data.categoria);
          setEstado(data.estado);
        } else {
          setError("Noticia no encontrada");
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar la noticia.");
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [id]);

  // 🔹 Actualizar la noticia
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const docRef = doc(db, "noticias", id);
      let imagenURL = noticia?.imagenURL || "";

      if (imagen) {
        const storageRef = ref(storage, `noticias/${Date.now()}-${imagen.name}`);
        await uploadBytes(storageRef, imagen);
        imagenURL = await getDownloadURL(storageRef);
      }

      await updateDoc(docRef, {
        titulo,
        subtitulo,
        contenido,
        categoria,
        estado,
        imagenURL,
        fechaActualizacion: new Date().toISOString(),
      });

      alert("✅ Noticia actualizada correctamente");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Error al actualizar la noticia. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-center text-white mt-20">Cargando...</p>;
  if (error)
    return <p className="text-center text-red-400 mt-20">{error}</p>;

  return (
    <div className="min-h-screen bg-private bg-cover bg-center bg-fixed flex items-center justify-center relative overflow-hidden">
      {/* Fondo translúcido */}
      <div className="absolute inset-0 bg-overlay" />

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 mx-4 text-white border border-slate-700/50">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-400 drop-shadow">
          ✏️ Editar Noticia
        </h1>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título de la noticia"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Subtítulo
            </label>
            <input
              type="text"
              value={subtitulo}
              onChange={(e) => setSubtitulo(e.target.value)}
              placeholder="Subtítulo (opcional)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Contenido
            </label>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              rows={6}
              placeholder="Contenido de la noticia..."
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Categoría
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Deportes">Deportes</option>
              <option value="Cultura">Cultura</option>
              <option value="Tecnología">Tecnología</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Estado
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="Edición">Edición</option>
              <option value="Revisión">Revisión</option>
              <option value="Publicado">Publicado</option>
              <option value="Desactivado">Desactivado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Imagen (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files[0])}
              className="text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
            >
              ← Volver
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
