export default function FreeForm({ formData, setFormData, types }) {
  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className="mb-3">
        <label className="form-label">Título</label>
        <input
          type="text"
          className="form-control"
          value={formData.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Tipo</label>
        <select
          className="form-select"
          value={formData.type_id}
          onChange={(e) => update("type_id", e.target.value)}
          required
        >
          <option value="">Selecciona</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">Nº participantes</label>
          <input
            type="number"
            className="form-control"
            value={formData.num_participants}
            onChange={(e) => update("num_participants", e.target.value)}
            required
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Edad mínima</label>
          <input
            type="number"
            className="form-control"
            value={formData.min_age}
            onChange={(e) => update("min_age", e.target.value)}
            required
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Edad máxima</label>
          <input
            type="number"
            className="form-control"
            value={formData.max_age}
            onChange={(e) => update("max_age", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Duración</label>
        <input
          type="number"
          className="form-control"
          value={formData.duration}
          onChange={(e) => update("duration", e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contenido libre</label>
        <textarea
          className="form-control"
          rows="15"
          value={formData.description}
          onChange={(e) => update("description", e.target.value)}
          required
        />
      </div>
    </>
  );
}
