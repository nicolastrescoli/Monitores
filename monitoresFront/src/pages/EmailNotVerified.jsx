import { useState } from "react";
import { resendVerificationEmail } from "../services/api";

export default function EmailNotVerified() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  async function handleResend() {
    try {
      await resendVerificationEmail();
      setSent(true);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al reenviar el email");
    }
  }

  return (
    <div className="container mt-5 text-center">
      <div className="card shadow p-5">
        <h1 className="text-warning mb-3">
          ⚠️ Debes verificar tu email antes de continuar.
        </h1>
        <p className="mb-3">Revisa tu bandeja de entrada.</p>

        {sent ? (
          <p className="text-success">Email enviado, revisa tu buzón de spam</p>
        ) : (
          <>
            <p>ó</p>
            <button className="btn btn-sm btn-outline-info col-3 align-self-center" onClick={handleResend}>
              Reenviar email de confirmación
            </button>
          </>
        )}

        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
}
