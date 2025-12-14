import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { typeColors } from "../schedules/components/typeColors";
import ActivityButtons from "./ActivityButtons";

export default function ActivityCard({ id }) {
  const { activities, typeNames } = useSelector((state) => state.activities);

  // Buscar la actividad en redux
  const activity = activities.find((a) => a.id === id);

  if (!activity) {
    return <div className="alert alert-info">Cargando actividad...</div>;
  }

  const typeName = typeNames[activity.type_id] || "Otro";
  const color = typeColors[activity.type_id] || "dark";

  return (
    <div className="activity-item">
      <div className="card h-100 border-0 shadow-lg rounded-4 bg-white">
        <div className="card-body d-flex flex-column justify-content-between">
          <Link
            to={`/activities/${activity.id}`}
            className="text-decoration-none text-dark"
          >
            <h5 className="card-title text-primary">{activity.title}</h5>
            <p className="card-text">
              <span className={`badge bg-${color} mb-1`}>{typeName}</span>
              <br />
              <strong>Edad:</strong> {activity.min_age}+<br />
              <strong>Participantes:</strong> {activity.num_participants}
            </p>
          </Link>

          <div className="mt-2">
            <ActivityButtons activity={activity} />
          </div>
        </div>
      </div>
    </div>
  );
}
