import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  requestPublication,
  cancelPublication,
  deleteActivityAction,
} from "../../redux/features/activitySlice";
import { toggleFavoriteActivity } from "../../redux/features/authSlice";
import DeleteModal from "./DeleteModal";

export default function ActivityButtons({ activity }) {
  const dispatch = useDispatch();

  const { loggedUser } = useSelector((state) => state.auth);

  const favoriteIds = loggedUser?.favoriteActivities?.map((fav) => fav.id) ?? [];
  const isFavorite = favoriteIds.includes(activity.id);

  const isOwner = loggedUser && activity.user_id === loggedUser.id;
  const isOwnerWithPublic = isOwner && activity.visibility === "public";

  return (
    <>
      {!isOwnerWithPublic && loggedUser && (
        <div>
          {isOwner ? (
            <>
              <Link
                className="btn btn-warning btn-sm ms-1"
                to={`/activities/edit/${activity.id}`}
              >
                Editar
              </Link>
              <DeleteModal
                buttonText={"Eliminar"}
                modalText={"¿Seguro que deseas eliminar esta actividad?"}
                deleteMethod={() => {
                  dispatch(deleteActivityAction(activity.id));
                  if (isFavorite) dispatch(toggleFavoriteActivity(activity.id));
                }}
              />
            </>
          ) : (
            activity.visibility === "public" && (
              <button
                className={`btn btn-sm ${
                  isFavorite ? "btn-warning" : "btn-outline-secondary"
                }`}
                onClick={() => dispatch(toggleFavoriteActivity(activity.id))}
              >
                {isFavorite ? "★ Favorito" : "☆ Añadir a favoritos"}
              </button>
            )
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
    </>
  );
}
