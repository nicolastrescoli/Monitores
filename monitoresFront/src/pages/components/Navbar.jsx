import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user: currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirige a login tras cerrar sesión
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-green">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Inicio
        </Link>

        {currentUser ? (
          <>
            <Link className="navbar-brand" to={`/profile`}>
              Perfil
            </Link>
            <Link className="navbar-brand" to="/community">
              Comunidad
            </Link>
          </>
        ) : (
          <>
            <Link className="navbar-brand" to="/login">
              Login
            </Link>
            <Link className="navbar-brand" to="/register">
              Registro
            </Link>
          </>
        )}

        <Link className="navbar-brand" to="#">
          Guías
        </Link>
        <Link className="navbar-brand" to="/about">
          Sobre Nosotros
        </Link>
        <Link className="navbar-brand" to="/contact">
          Contacto
        </Link>

        {currentUser && (
          <button
            className="btn btn-outline-light"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
