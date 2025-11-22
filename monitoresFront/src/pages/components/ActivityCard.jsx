import { Link } from "react-router-dom";
import {
  cancelSubmission,
  deleteActivity,
  submitPublic,
  toggleFavorite,
} from "../../services/api";
import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function ActivityCard({
  activity,
  userJoinedActivities = [],
}) {
  const { user: currentUser, fetchProfile } = useContext(AuthContext);

  const isOwner = currentUser.id && activity.user_id === currentUser.id;
  const isFavorite = userJoinedActivities.includes(activity.id);
  const isOwnerWithPublic = isOwner && activity.visibility === "public";

  const [visibility, setVisibility] = useState(activity.visibility);

  // Mapear type_id a nombre
  const typeNames = {
    1: "Juego",
    2: "Actividad Física",
    3: "Manualidad",
  };
  const typeName = typeNames[activity.type_id] || "Otro";

  async function handleSubmitPublic(activityId) {
    try {
      await submitPublic(activityId);
      setVisibility("pending");
    } catch (err) {
      console.error(
        "Error al enviar actividad:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Error al solicitar publicación");
    }
  }

  async function handleCancelSubmission(activityId) {
    try {
      await cancelSubmission(activityId);
      setVisibility("private");
    } catch (err) {
      console.error("Error al cancelar:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error al cancelar solicitud");
    }
  }

  async function handleToggleFavorite(activityId) {
    try {
      await toggleFavorite(activityId);
      await fetchProfile(); // 🔹 recarga profileData automáticamente
    } catch (err) {
      console.error(err);
      alert("Error al guardar favorito");
    }
  }

    // --- ELIMINAR ACTIVIDAD ---
  async function handleDeleteActivity(activityId) {
    try {
      await deleteActivity(activityId);
      await fetchProfile(); // 🔹 recarga profileData automáticamente
    } catch (err) {
      console.error(err);
      alert("Error al eliminar actividad");
    }
  }

  return (
    <div
      className="col-md-4 activity-item"
      data-nombre={activity.title.toLowerCase()}
      data-tipo={typeName}
      data-edad={activity.min_age}
      data-participantes={activity.num_participants}
    >
      <div
        className={`card h-100 border-0 shadow-lg rounded-4 ${
          isOwner ? "border-success bg-white" : "border-secondary bg-white"
        }`}
      >
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <Link
              to={`/activities/${activity.id}`}
              className="text-decoration-none text-dark"
            >
              <h5 className="card-title text-primary">{activity.title}</h5>
              <p className="card-text text-dark">
                <span className="badge bg-success mb-1">{typeName}</span>
                <br />
                <strong>Edad:</strong> {activity.min_age}+
                <br />
                <strong>Participantes:</strong> {activity.num_participants}
              </p>
            </Link>
          </div>

          {/* Acciones del usuario */}
          {!isOwnerWithPublic && (
            <div className="mt-3">
              {isOwner ? (
                <>
                  <Link
                    to={`/activities/edit/${activity.id}`}
                    className="btn btn-sm btn-warning ms-1"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm ms-1"
                    onClick={() => handleDeleteActivity(activity.id)}
                  >
                    Eliminar
                  </button>
                </>
              ) : visibility === "public" ? (
                <button
                  className={`btn btn-sm ${
                    isFavorite ? "btn-warning" : "btn-outline-secondary"
                  }`}
                  onClick={() => handleToggleFavorite(activity.id)}
                >
                  {isFavorite ? "★ Favorito" : "☆ Añadir a favoritos"}
                </button>
              ) : null}

              {/* Clonar si es favorito y público */}
              {isFavorite && visibility === "public" && (
                <button
                  className="btn btn-sm ms-1"
                  onClick={() => console.log("Clonar actividad", activity.id)}
                >
                  Modificar
                </button>
              )}

              {/* Publicación */}
              {isOwner && (
                <div className="mt-2">
                  {visibility === "private" && (
                    <button
                      className="btn btn-primary btn-sm ms-1"
                      onClick={() => handleSubmitPublic(activity.id)}
                    >
                      Solicitar publicación
                    </button>
                  )}
                  {visibility === "pending" && (
                    <button
                      className="btn btn-outline-warning btn-sm ms-1"
                      onClick={() => handleCancelSubmission(activity.id)}
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
