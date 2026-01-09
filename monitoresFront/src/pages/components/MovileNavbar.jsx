import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/features/authSlice";

export default function MovileNavbar({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loggedUser } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="bg-success d-md-none">
      <ul className="nav flex-column p-2">
        <li className="nav-item">
          <Link className="nav-link" to="/" onClick={() => setOpen(false)}>
            Inicio
          </Link>
        </li>
        {loggedUser?.role === "admin" && (
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/activities/pending"
              onClick={() => setOpen(false)}
            >
              Panel de Administración
            </Link>
          </li>
        )}

        {loggedUser?.email_verified_at ? (
          <>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/profile"
                onClick={() => setOpen(false)}
              >
                Perfil
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/community"
                onClick={() => setOpen(false)}
              >
                Comunidad
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/login"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/register"
                onClick={() => setOpen(false)}
              >
                Registro
              </Link>
            </li>
          </>
        )}

        <li className="nav-item">
          <Link
            className="nav-link"
            to="/topColaborators"
            onClick={() => setOpen(false)}
          >
            Top Actividades
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/about" onClick={() => setOpen(false)}>
            Sobre el Proyecto
          </Link>
        </li>

        {loggedUser?.email_verified_at && (
          <li className="nav-item">
            <button
              className="btn nav-link"
              style={{ border: "none", background: "transparent" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
