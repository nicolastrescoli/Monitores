import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingActivities,
  approveActivityAction,
  rejectActivityAction
} from "../redux/features/activitySlice";

export default function AdminPanel2() {
  const dispatch = useDispatch();
  const { pendingActivities, pendingLoading } = useSelector(state => state.activities);

  useEffect(() => {
    dispatch(fetchPendingActivities());
  }, [dispatch]);

  return (
    <div className="container">
      <h2 className="mb-4">Actividades pendientes de revisión</h2>

      {pendingLoading && <p>Cargando...</p>}
      {!pendingLoading && pendingActivities.length === 0 && <p>No hay actividades pendientes.</p>}

      <div className="row">
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

                <Link to={`/activities/${activity.id}`} className="btn btn-info btn-sm">
                  Ver actividad
                </Link>

                <button
                  className="btn btn-success btn-sm ms-2"
                  onClick={() => dispatch(approveActivityAction(activity.id))}
                >
                  Aprobar
                </button>

                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => dispatch(rejectActivityAction(activity.id))}
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
