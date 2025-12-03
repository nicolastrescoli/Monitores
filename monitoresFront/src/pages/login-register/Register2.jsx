import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/api";
import { loginUser } from "../../redux/features/authSlice";

export default function Register2() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "user",
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = [];

    if (!form.name) validationErrors.push("El nombre es obligatorio.");
    if (!form.email) validationErrors.push("El correo electrónico es obligatorio.");
    if (!form.password) validationErrors.push("La contraseña es obligatoria.");
    if (form.password !== form.passwordConfirmation)
      validationErrors.push("Las contraseñas no coinciden.");

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await register(form);
      dispatch(loginUser({ email: form.email, password: form.password }));
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrors(["Error al registrar. Inténtalo de nuevo."]);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Registro</h4>
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
                  <label htmlFor="role" className="form-label">
                    Eres monitor/a u organización
                  </label>
                  <select
                    id="role"
                    className="form-select"
                    value={form.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="user">Monitor/a</option>
                    <option value="organization">Organización</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
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
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="passwordConfirmation" className="form-label">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    id="passwordConfirmation"
                    className="form-control"
                    autoComplete="new-password"
                    value={form.passwordConfirmation}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Registrarse
                </button>
              </form>

              <p className="mt-3 text-center">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
