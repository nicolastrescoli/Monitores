import { Outlet } from "react-router-dom";
import "../app.css";
import Navbar from "../pages/components/Navbar";

export default function Layout() {

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="py-3 text-center">
        <h1 className="mb-0">OcioEducativo.es</h1>
      </header>

      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center mt-5">
        <p className="mb-0">&copy; {new Date().getFullYear()} Nicolás Trescolí Blasco</p>
      </footer>
    </div>
    
  );
}
