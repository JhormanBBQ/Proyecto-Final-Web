// src/routes/AppRouter.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/admin/Dashboard";
import NuevaNoticia from "../pages/admin/NuevaNoticia";
import EditarNoticia from "../pages/admin/EditarNoticia";
import NoticiaDetalle from "../pages/public/NoticiaDetalle"; // 🔹 NUEVO

function AppRouter() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<Home />} />
      <Route path="/noticia/:id" element={<NoticiaDetalle />} /> {/* 🔹 NUEVO */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Panel administrativo */}
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/nueva-noticia" element={<NuevaNoticia />} />
      <Route path="/admin/editar/:id" element={<EditarNoticia />} />

      {/* Página no encontrada */}
      <Route
        path="*"
        element={
          <h1 className="text-center mt-10 text-3xl">404 - Página no encontrada</h1>
        }
      />
    </Routes>
  );
}

export default AppRouter;
