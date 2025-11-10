import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("reportero");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Guardar datos adicionales en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre,
        email,
        rol,
        fechaRegistro: new Date().toISOString(),
      });

      // 3️⃣ Actualizar nombre en el perfil de Firebase Auth
      await updateProfile(user, { displayName: nombre });

      // 4️⃣ Redirigir al login
      navigate("/login");
    } catch (err) {
  console.error("Error al registrar:", err);

  if (err.code === "auth/email-already-in-use") {
    setError("Este correo ya está registrado. Intenta iniciar sesión.");
  } else if (err.code === "auth/invalid-email") {
    setError("El correo ingresado no es válido.");
  } else if (err.code === "auth/weak-password") {
    setError("La contraseña debe tener al menos 6 caracteres.");
  } else {
    setError("Ocurrió un error al crear la cuenta. Intenta nuevamente.");
  }
}

  };

  return (
  <div className="min-h-screen bg-public flex items-center justify-center">
    <div className="bg-overlay w-full max-w-md mx-4 p-8 rounded-2xl shadow-xl text-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-400">Crear Cuenta</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold transition"
        >
          {loading ? "Creando..." : "Registrarse"}
        </button>
      </form>

      <p className="text-center text-gray-400 mt-4 text-sm">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-blue-400 hover:underline">
          Inicia sesión aquí
        </a>
      </p>
    </div>
  </div>
);

}

