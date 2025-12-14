import { useState } from "react";
import ActivityCard from "./components/ActivityCard";
import RandomActivity from "./RandomActivity";
import Filters from "./Filters";

export default function Home() {

  const [ displayedActivities, setDisplayedActivities ] = useState([]);

  return (
    <div className="container py-3">
      <div className="d-flex d-md-block justify-content-between">
        {/* Filtros */}
        <Filters setDisplayedActivities={setDisplayedActivities}/>
        {/* Botón aleatorio */}
        <RandomActivity buttonText={"🎲 Actividad Aleatoria"} />
      </div>

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
