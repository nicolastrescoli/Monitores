import { useState } from "react";

export default function Filters({ filters, setFilters, types }) {
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mb-4">
      {/* Botón para móvil */}
      <button
        className="btn btn-outline-primary btn-lg d-md-none mb-2 w-100"
        type="button"
        onClick={() => setOpen(!open)}
      >
        {open ? "Cerrar" : "Filtros"}
      </button>

      {/* Contenedor de filtros */}
      <div className={`row g-3 bg-light p-3 rounded shadow-sm ${open ? "" : "d-none d-md-flex"}`}>
        {/* Título */}
        <div className="col-12 col-md-2">
          <input
            type="text"
            name="title"
            className="form-control border-primary"
            placeholder="🔍 Título"
            value={filters.title}
            onChange={handleChange}
          />
        </div>

        {/* Tipo */}
        <div className="col-12 col-md-2">
          <select
            name="type_id"
            className="form-select border-success"
            value={filters.type_id}
            onChange={handleChange}
          >
            <option value="">🎯 Tipo</option>
            {types &&
              Object.entries(types).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
          </select>
        </div>

        {/* Edad mínima */}
        <div className="col-12 col-md-2">
          <input
            type="number"
            name="edadMin"
            className="form-control border-warning"
            placeholder="👶 Edad mínima"
            value={filters.edadMin}
            onChange={handleChange}
          />
        </div>

        {/* Edad máxima */}
        <div className="col-12 col-md-2">
          <input
            type="number"
            name="edadMax"
            className="form-control border-warning"
            placeholder="🧓 Edad máxima"
            value={filters.edadMax}
            onChange={handleChange}
          />
        </div>

        {/* Participantes */}
        <div className="col-12 col-md-2">
          <input
            type="number"
            name="participantes"
            className="form-control border-info"
            placeholder="👥 Participantes"
            value={filters.participantes}
            onChange={handleChange}
          />
        </div>

        {/* Ordenar por */}
        <div className="col-12 col-md-2">
          <select
            name="ordenarPor"
            className="form-select border-dark"
            value={filters.ordenarPor}
            onChange={handleChange}
          >
            <option value="">↕️ Ordenar por</option>
            <option value="title">Título</option>
            <option value="type_id">Tipo</option>
            <option value="min_age">Edad mínima</option>
            <option value="num_participants">Participantes</option>
            <option value="duration">Duración</option>
          </select>
        </div>
      </div>
    </div>
  );
}
