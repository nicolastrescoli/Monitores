import { useState } from "react";
import { useSelector } from "react-redux";
import ActivityCard from "./components/ActivityCard";
import RandomActivity from "./RandomActivity";
import Filters from "./Filters";

export default function Home({types}) {

  const { activities } = useSelector(state => state.activities);

  const [filters, setFilters] = useState({
    title: "",
    type_id: "",
    edadMin: 0,
    edadMax: 99,
    participantes: "",
    ordenarPor: "",
  });

  const filtrarYOrdenar = () => {

    const publicActivities = activities.filter((a) => a.visibility === 'public')

    let filtrados = [...publicActivities];

    filtrados = filtrados.filter((a) =>
      a.title.toLowerCase().includes(filters.title.toLowerCase())
    );

    if (filters.type_id)
      filtrados = filtrados.filter((a) => String(a.type_id) === filters.type_id);

    filtrados = filtrados.filter(
      (a) => a.min_age <= filters.edadMax && a.max_age >= filters.edadMin
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

  const handleRandom = () => {
    const items = filtrarYOrdenar();
    if (items.length > 0) {
      const random = items[Math.floor(Math.random() * items.length)];
      return random;
    }
  };

  const displayedActivities = filtrarYOrdenar();

  return (
    <div className="container py-4">
      {/* Filtros */}
      <Filters filters={filters} setFilters={setFilters} types={types}/>

      {/* Botón aleatorio */}
      <RandomActivity buttonText={"🎲 Actividad Aleatoria"} handleRandom={handleRandom} />

      {/* Lista de actividades */}
      <div className="row gy-4" id="listaactivities">
        {displayedActivities.map((activity) => (
          <div key={activity.id} className="col-md-4">
            <ActivityCard id={activity.id} />
          </div>
        ))}
        {displayedActivities.length === 0 && (
          <div className="alert alert-info">No hay actividades que coincidan con los filtros.</div>
        )}
      </div>
    </div>
  );
}
