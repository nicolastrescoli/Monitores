import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, fetchLoggedUser } from "../../redux/features/authSlice";
import { fetchUsers } from "../../redux/features/communitySlice";
import { OrbitProgress } from "react-loading-indicators";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await dispatch(loginUser({ email, password })).unwrap();
      if (!user.email_verified_at) {
        navigate("/email-notverified");
      } 
      else {
        // Cargar perfil completo tras login
        await dispatch(fetchLoggedUser()).unwrap();
        dispatch(fetchUsers());
        navigate("/");
      }
    } catch (err) {
      console.error("Error login:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <OrbitProgress dense color="#32cd32" size="medium" text="" textColor="" />
        <div className="container py-5">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Iniciar sesión</h4>
            </div>
            <div className="card-body bg-light">
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="current-email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>

              <p className="mt-3 text-center">
                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
