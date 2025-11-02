import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = [];

    if (!email) validationErrors.push("El correo electrónico es obligatorio.");
    if (!password) validationErrors.push("La contraseña es obligatoria.");

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Simulación de login
    const role = email === "admin@example.com" ? "admin" : "user";
    login(email, role);

    // Redirigir a la página principal
    navigate("/");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Iniciar sesión</h4>
            </div>
            <div className="card-body bg-light">
              {errors.length > 0 && (
                <div className="alert alert-danger">
                  <ul className="mb-0">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Entrar
                </button>
              </form>

              <p className="mt-3 text-center">
                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
