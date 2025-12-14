import { Outlet } from "react-router-dom";
import "../app.css";
import Navbar from "../pages/components/Navbar";
import { useState } from "react";
import MovileNavbar from "../pages/components/MovileNavbar";

export default function Layout() {

  const [open, setOpen] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="py-3 text-center d-flex justify-content-center">
        <div className="d-sm-none">
          <button
            className="btn btn-outline-light me-4"
            type="button"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
        <h1 className="mb-0">OcioEducativo.es</h1>
        {/* <img src="/src/assets/logo.png" width={60} alt="Logo" /> */}
      </header>

      {/* Navbar */}
      <div className="d-none d-sm-block">
        <Navbar />
      </div>
      {open && (
        <MovileNavbar />
      )}

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
