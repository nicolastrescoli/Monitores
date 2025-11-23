import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la llamada a tu API o backend
    console.log("Mensaje enviado:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container py-4">
      <div className="card border-0 shadow">
        <div className="card-header bg-dark text-white">
          <h2>Contacto</h2>
        </div>
        <div className="card-body bg-light text-dark">
          <p className="mb-4">
            ¿Tienes alguna pregunta, sugerencia o propuesta? ¡Estamos encantados de escucharte!
          </p>

          {submitted && (
            <div className="alert alert-success">¡Tu mensaje ha sido enviado!</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nombre</label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">Mensaje</label>
              <textarea
                name="message"
                id="message"
                rows="5"
                className="form-control"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-success">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
