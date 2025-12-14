import { Link } from "react-router-dom";

export default function EmailVerified() {
  return (
    <div className="container mt-5 text-center">
      <div className="card shadow p-5">
        <h1 className="text-success mb-3">✅ Cuenta verificada</h1>
        <p className="mb-4">
          Tu cuenta ha sido activada correctamente.
          Ya puedes iniciar sesión y usar la plataforma.
        </p>
        <Link to="/login" className="btn btn-success btn-lg">
          Ir al login
        </Link>
      </div>
    </div>
  );
}
