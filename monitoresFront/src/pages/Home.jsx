import { useState } from "react";
import ActivityCard from "./components/ActivityCard";

export default function Home({activities, setActivities, profileData}) {

  const [filters, setFilters] = useState({
    title: "",
    type_id: "",
    edadMin: 0,
    edadMax: 99,
    participantes: "",
    ordenarPor: "",
  });

  const { user, favoriteActivities, schedules, contacts } = profileData;
  
  const joined = favoriteActivities.filter((act) => act.user_id !== user.id);

  const filtrarYOrdenar = () => {
    let filtrados = [...activities];

    filtrados = filtrados.filter((a) =>
      a.title.toLowerCase().includes(filters.title.toLowerCase())
    );

    if (filters.type_id) filtrados = filtrados.filter((a) => String(a.type_id) === filters.type_id);

    filtrados = filtrados.filter(
      (a) => a.min_age <= filters.edadMax && a.max_age >= filters.edadMin
    );

    if (filters.participantes) {
      filtrados = filtrados.filter(
        (a) => a.num_participants === parseInt(filters.participantes)
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

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleRandom = () => {
    const items = filtrarYOrdenar();
    if (items.length > 0) {
      const random = items[Math.floor(Math.random() * items.length)];
      setActivities([random]);
    }
  };

  const displayedActivities = filtrarYOrdenar();

  return (
    <div className="container py-4">
      {/* Filtros */}
      <div className="row g-3 mb-4 bg-light p-3 rounded shadow-sm">
        <div className="col-md-2">
          <input
            type="text"
            name="title"
            className="form-control border-primary"
            placeholder="🔍 Título"
            value={filters.title}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <select
            name="type_id"
            className="form-select border-success"
            value={filters.type_id}
            onChange={handleChange}
          >
            <option value="">🎯 Tipo</option>
            <option value="1">Juego</option>
            <option value="2">Actividad Física</option>
            <option value="3">Manualidad</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="number"
            name="edadMin"
            className="form-control border-warning"
            placeholder="👶 Edad mínima"
            value={filters.edadMin}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            name="edadMax"
            className="form-control border-warning"
            placeholder="🧓 Edad máxima"
            value={filters.edadMax}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            name="participantes"
            className="form-control border-info"
            placeholder="👥 Participantes"
            value={filters.participantes}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
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

      {/* Botón aleatorio */}
      <div className="text-end mb-4">
        <button className="btn btn-outline-primary btn-lg" onClick={handleRandom}>
          🎲 Actividad Aleatoria
        </button>
      </div>

      {/* Lista de actividades */}
      <div className="row gy-4" id="listaactivities">
        {displayedActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} 
                        userJoinedActivities={joined.map((fav) => fav.id)}/>
        ))}
        {displayedActivities.length === 0 && (
          <div className="alert alert-info">No hay actividades que coincidan con los filtros.</div>
        )}
      </div>
    </div>
  );
}
