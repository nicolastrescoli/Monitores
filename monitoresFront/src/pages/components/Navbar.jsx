import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/features/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loggedUser, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-green">
      <div className="container">
        <Link className="navbar-brand" to="/">Inicio</Link>

        {/* Panel de administración */}
        {loggedUser?.role === "admin" && (
          <Link className="navbar-brand" to="/activities/pending">
            Panel de Administración
          </Link>
        )}

        {isAuthenticated ? (
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

        <Link className="navbar-brand" to="/topColaborators">
          Top Actividades & Colaboradores
        </Link>
        <Link className="navbar-brand" to="/about">Sobre el Proyecto</Link>
        {isAuthenticated && (            
          <button className="btn btn-link navbar-brand"
              onClick={handleLogout}
            >
            Logout
          </button>)}
      </div>
    </nav>
  );
}
