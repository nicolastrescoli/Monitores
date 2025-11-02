import { Outlet, Link } from "react-router-dom";
// import { useContext } from "react";
import "../app.css"; // Asegúrate de ajustar la ruta según tu estructura

import Navbar from "../components/Navbar"; // Equivalente a tu include('partials.navbar')
// import { AuthContext } from "../contexts/AuthContext"; // Ejemplo de contexto para autenticación

export default function Layout() {
  // const { user } = useContext(AuthContext) || {}; // Simula Auth::user() de Laravel

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="py-3 text-center">
        <h1 className="mb-0">🌿 Actividades y Juegos</h1>
      </header>

      {/* Panel de administración */}
      {/* {user?.role === "admin" && (
        <h2 className="mb-0 py-3 text-center">
          <Link to="/activities/pending">Panel de Administración</Link>
        </h2>
      )} */}

      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center mt-5">
        <p className="mb-0">&copy; {new Date().getFullYear()} Actividades Verdes</p>
      </footer>
    </div>
  );
}
