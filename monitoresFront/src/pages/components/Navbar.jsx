import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user: currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-green">
      <div className="container">
        <Link className="navbar-brand" to="/">Inicio</Link>
 
      {/* Panel de administración */}
      {currentUser?.role === "admin" && (
        <Link className="navbar-brand" to="/activities/pending">Panel de Administración</Link>
      )}

        {currentUser ? (
          <>
            <Link className="navbar-brand" to="/profile">Perfil</Link>
            <Link className="navbar-brand" to="/community">Comunidad</Link>
          </>
        ) : (
          <>
            <Link className="navbar-brand" to="/login">Login</Link>
            <Link className="navbar-brand" to="/register">Registro</Link>
          </>
        )}

        <Link className="navbar-brand" to="/topColaborators">Top Actividades & Colaboradores</Link>
        <Link className="navbar-brand" to="/about">Sobre el Proyecto</Link>
        {/* <Link className="navbar-brand" to="/contact">Contacto</Link> */}

        {currentUser && (
          <Link className="navbar-brand" onClick={handleLogout}>Logout</Link>
        )}
      </div>
    </nav>
  );
}
