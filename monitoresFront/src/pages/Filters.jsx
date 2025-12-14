import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Filters({ setDisplayedActivities }) {
  const { activities, typeNames } = useSelector((state) => state.activities);

  const [open, setOpen] = useState(false);

  const initialFilters = {
    title: "",
    type_id: "",
    edadMin: 0,
    edadMax: 99,
    participantes: "",
    ordenarPor: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  const filtrarYOrdenar = () => {
    const publicActivities = activities.filter(
      (a) => a.visibility === "public"
    );

    let filtrados = [...publicActivities];

    filtrados = filtrados.filter((a) =>
      a.title.toLowerCase().includes(filters.title.toLowerCase())
    );

    if (filters.type_id)
      filtrados = filtrados.filter(
        (a) => String(a.type_id) === filters.type_id
      );

    filtrados = filtrados.filter(
      (a) =>
        (filters.edadMin === "" || a.min_age >= filters.edadMin) &&
        (filters.edadMax === "" || a.max_age <= filters.edadMax)
    );

    if (filters.participantes) {
      filtrados = filtrados.filter(
        (a) => a.num_participants <= parseInt(filters.participantes)
      );
    }

    if (filters.ordenarPor) {
      filtrados.sort((a, b) => {
        const va = a[filters.ordenarPor];
        const vb = b[filters.ordenarPor];
        return isNaN(va) ? String(va).localeCompare(String(vb)) : va - vb;
      });
    }

    return filtrados;
  };

  useEffect(() => {
    setDisplayedActivities(filtrarYOrdenar());
  }, [filters, activities]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Convertir a número si es edad o participantes
    if (["edadMin", "edadMax", "participantes"].includes(name)) {
      newValue = Number(value);

      // Limitar a valores positivos
      if (newValue < 0) newValue = 0;
    }

    setFilters((prev) => {
      let updated = { ...prev, [name]: newValue };

      // Asegurar que edadMax >= edadMin
      if (name === "edadMin" && newValue > prev.edadMax) {
        updated.edadMax = newValue;
      }
      if (name === "edadMax" && newValue < prev.edadMin) {
        updated.edadMin = newValue;
      }

      return updated;
    });
  };

  const resetFilters = () => {
    setFilters(initialFilters);
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
      <div
        className={`row g-3 bg-light p-3 rounded shadow-sm ${
          open ? "" : "d-none d-md-flex"
        }`}
      >
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
            {typeNames &&
              Object.entries(typeNames).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
          </select>
        </div>

        {/* Edad mínima */}
        <div className="col-6 col-md-1">
          <input
            type="number"
            name="edadMin"
            min={0}
            step={1}
            className="form-control border-warning"
            placeholder="👶 Edad mínima"
            value={filters.edadMin}
            onChange={handleChange}
          />
        </div>

        {/* Edad máxima */}
        <div className="col-6 col-md-1">
          <input
            type="number"
            name="edadMax"
            min={0}
            step={1}
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
            min={0}
            step={1}
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

        {/* Botón de restablecer */}
        <div className="col-12 col-md-2">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={resetFilters}
          >
            🔄 Restablecer filtros
          </button>
        </div>
      </div>
    </div>
  );
}
