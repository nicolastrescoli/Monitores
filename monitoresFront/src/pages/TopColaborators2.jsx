import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, fetchTopFavorites } from "../redux/features/statsSlice";
import { Link } from "react-router-dom";

export default function TopColaborators2() {
  const dispatch = useDispatch();

  const { topFavorites, topUsers, loading } = useSelector(state => state.stats);
  const { activities } = useSelector(state => state.activities);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (activities.length > 0) {
      dispatch(fetchTopFavorites());
    }
  }, [dispatch, activities]);

  if (loading) return <p>Cargando...</p>;

  const styleMap = [
    { bg: "bg-warning", size: "h3", width: "col-md-12" },
    { bg: "bg-secondary", size: "h4", width: "col-md-11" },
    { bg: "bg-success", size: "h5", width: "col-md-10" },
    { bg: "bg-primary", size: "h6", width: "col-md-4" },
    { bg: "bg-primary", size: "h6", width: "col-md-4" },
  ];

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Top Actividades</h2>
      <div className="row g-2 justify-content-center">
        {topFavorites.map((act, index) => {
          const style = styleMap[index] || { bg: "bg-light", size: "small" };
          return (
            <div key={act.id} className={`${style.width} text-center`}>
              <Link to={`/activities/${act.id}`}>
                <div className={`card ${style.bg} text-dark border-3`}>
                  <div className={`p-2 ${style.size}`}>
                    <strong>{act.title}</strong> – {act.favorites_count} veces guardada
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <h2 className="text-center my-4">Top Colaboradores</h2>
      <div className="list-group">
        {topUsers.map((user) => (
          <div
            key={user.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{user.name}</span>
            <span className="badge bg-primary rounded-pill">
              {user.publicActivitiesCount} publicaciones
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
