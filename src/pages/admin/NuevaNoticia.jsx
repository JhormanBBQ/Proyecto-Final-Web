// src/pages/admin/NuevaNoticia.jsx
import { useState } from "react";
import { db, storage, auth } from "../../services/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function NuevaNoticia() {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("General");
  const [estado, setEstado] = useState("Edición");
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Debes iniciar sesión para crear una noticia.");
        setLoading(false);
        return;
      }

      // 🔹 Obtener nombre del usuario desde Firestore
      let autorNombre = "Desconocido";
      try {
        const userDocRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          autorNombre = userSnap.data().nombre || "Desconocido";
        }
      } catch (error) {
        console.warn("No se pudo obtener el nombre del autor:", error);
      }

      // 🔹 Subir imagen (si hay)
      let imagenURL = "";
      if (imagen) {
        try {
          const storageRef = ref(storage, `noticias/${Date.now()}-${imagen.name}`);
          await uploadBytes(storageRef, imagen);
          imagenURL = await getDownloadURL(storageRef);
        } catch (err) {
          console.warn("No se pudo subir la imagen:", err);
        }
      }

      // 🔹 Guardar noticia con estado
      await addDoc(collection(db, "noticias"), {
        titulo,
        subtitulo,
        contenido,
        categoria,
        estado,
        imagenURL,
        autorId: user.uid,
        autorNombre,
        fechaCreacion: serverTimestamp(),
        fechaLegible: new Date().toLocaleString(),
      });

      alert("✅ Noticia creada correctamente");
      navigate("/admin");
    } catch (err) {
      console.error("Error al crear noticia:", err);
      setError("No se pudo guardar la noticia. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-private bg-cover bg-center bg-fixed flex items-center justify-center relative overflow-hidden">
      {/* Fondo translúcido */}
      <div className="absolute inset-0 bg-overlay" />

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 mx-4 text-white border border-slate-700/50">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400 drop-shadow">
          📰 Crear Nueva Noticia
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Escribe el contenido aquí..."
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
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Noticia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

