import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  requestPublication,
  cancelPublication,
  deleteActivityAction,
} from "../../redux/features/activitySlice";
import { toggleFavoriteActivity } from "../../redux/features/authSlice";
import DeleteModal from "./DeleteModal";

export default function ActivityCard({ id }) {
  const dispatch = useDispatch();

  const { activities, typeNames } = useSelector((state) => state.activities);
  const { loggedUser } = useSelector((state) => state.auth);

  // Buscar la actividad en redux
  const activity = activities.find((a) => a.id === id);

  if (!activity) {
    return <div className="alert alert-info">Cargando actividad...</div>;
  }

  const favoriteIds = loggedUser?.favoriteActivities?.map(fav => fav.id) ?? [];
  const isFavorite = favoriteIds.includes(activity.id);

  const isOwner = loggedUser && activity.user_id === loggedUser.id;
  const isOwnerWithPublic = isOwner && activity.visibility === "public";

  const typeName = typeNames[activity.type_id] || "Otro";

  return (
    <div className="activity-item">
      <div className="card h-100 border-0 shadow-lg rounded-4 bg-white">
        <div className="card-body d-flex flex-column justify-content-between">
          
          <Link to={`/activities/${activity.id}`} className="text-decoration-none text-dark">
            <h5 className="card-title text-primary">{activity.title}</h5>
            <p className="card-text">
              <span className="badge bg-success mb-1">{typeName}</span><br />
              <strong>Edad:</strong> {activity.min_age}+<br />
              <strong>Participantes:</strong> {activity.num_participants}
            </p>
          </Link>

          {(!isOwnerWithPublic && loggedUser ) && (
            <div className="mt-3">
              {isOwner ? (
                <>
                  <Link className="btn btn-warning btn-sm ms-1" to={`/activities/edit/${activity.id}`}>
                    Editar
                  </Link>
                  <DeleteModal 
                    buttonText={"Eliminar"} 
                    modalText={"¿Seguro que deseas eliminar esta actividad?"} 
                    deleteMethod={() => {                    
                      dispatch(deleteActivityAction(activity.id))
                      if (isFavorite) dispatch(toggleFavoriteActivity(activity.id))
                    }}
                  />
                </>
              ) : activity.visibility === "public" && (
                <button
                  className={`btn btn-sm ${isFavorite ? "btn-warning" : "btn-outline-secondary"}`}
                  onClick={() => dispatch(toggleFavoriteActivity(activity.id))}
                >
                  {isFavorite ? "★ Favorito" : "☆ Añadir a favoritos"}
                </button>
              )}

              {isOwner && (
                <div className="mt-2">
                  {activity.visibility === "private" && (
                    <button
                      className="btn btn-primary btn-sm ms-1"
                      onClick={() => dispatch(requestPublication(activity.id))}
                    >
                      Solicitar publicación
                    </button>
                  )}

                  {activity.visibility === "pending" && (
                    <button
                      className="btn btn-outline-warning btn-sm ms-1"
                      onClick={() => dispatch(cancelPublication(activity.id))}
                    >
                      Cancelar envío
                    </button>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
