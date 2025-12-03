import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPending, approveActivity, rejectActivity } from "../services/api";

export default function AdminPanel() {
  const [pendingActivities, setPendingActivities] = useState([]);

  useEffect(() => {
    fetchPendingActivities();
  }, []);

  const fetchPendingActivities = async () => {
    try {
      const res = await getPending();
      setPendingActivities(res.activities);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveActivity = async (id) => {
    try {
      await approveActivity(id);
      fetchPendingActivities(); // refresca la lista
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectActivity = async (id) => {
    try {
      await rejectActivity(id);
      fetchPendingActivities();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Actividades pendientes de revisión</h2>

      <div className="row">
        {pendingActivities.length === 0 && <p>No hay actividades pendientes.</p>}

        {pendingActivities.map((activity) => (
          <div key={activity.id} className="col-md-6 mb-4">
            <div className="card shadow rounded-4">
              <div className="card-body">
                <h5 className="card-title">{activity.title}</h5>
                <p className="card-text">
                  <strong>Tipo:</strong> {activity.type?.name}<br />
                  <strong>Edad mínima:</strong> {activity.min_age}<br />
                  <strong>Participantes:</strong> {activity.num_participants}<br />
                  <strong>Autor:</strong> {activity.creator?.name}
                </p>

                <Link
                  to={`/activities/${activity.id}`}
                  className="btn btn-info btn-sm"
                >
                  Ver actividad
                </Link>

                <button
                  className="btn btn-success btn-sm ms-2"
                  onClick={() => handleApproveActivity(activity.id)}
                >
                  Aprobar
                </button>

                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleRejectActivity(activity.id)}
                >
                  Denegar
                </button>
                </div>
              </div>
            </div>
          
        ))}
      </div>
    </div>
  );
}
