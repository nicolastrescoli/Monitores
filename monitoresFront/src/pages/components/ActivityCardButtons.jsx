import {
  cancelSubmission,
  deleteActivity,
  submitPublic,
  toggleFavorite,
} from "../../services/api";

export function ActivityCardButtons({ activity, currentUser, setVisibility, isFavorite, setIsFavorite}) {

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
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
      alert("Error al guardar favorito");
    }
  }

  // --- ELIMINAR ACTIVIDAD ---
  async function handleDeleteActivity(activityId) {
    try {
      await deleteActivity(activityId);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar actividad");
    }
  }

  return (<>
    <>
      {currentUser !== null &&
        // Acciones del usuario
        !isOwnerWithPublic && (
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
    </>
    <></>
  );
}
