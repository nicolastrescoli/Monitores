import { useEffect, useState } from "react";
import { getTopFavoriteActivities, getUsers } from "../services/api";
import { Link } from "react-router-dom";

export default function TopFavorites({ activities }) {
  const [topFavorites, setTopFavorites] = useState([]);
  const [users, setUsers] = useState([]); // todos los usuarios
  const [topUsers, setTopUsers] = useState([]); // top 5 usuarios con más actividades públicas

  // Cargar usuarios solo una vez
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.users || []);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      }
    };
    fetchUsers();
  }, []);

  // Cargar top actividades favoritas cada vez que cambian las activities
  useEffect(() => {
    const fetchTopFavorites = async () => {
      try {
        const topFavs = await getTopFavoriteActivities();
        const merged = topFavs
          .map((fav) => {
            const activity = activities.find((a) => a.id === fav.activity_id);
            if (!activity) return null; // evita undefined
            return {
              ...activity,
              favorites_count: fav.favorites_count,
            };
          })
          .filter(Boolean) // elimina null
          .sort((a, b) => b.favorites_count - a.favorites_count); // ordena por número de favoritos

        setTopFavorites(merged);
      } catch (err) {
        console.error(err);
      }
    };

    if (activities.length > 0) {
      fetchTopFavorites();
    }
  }, [activities]);

  // Calcular top 5 usuarios con más actividades públicas
  useEffect(() => {
    if (activities.length === 0 || users.length === 0) return;

    const publicActivities = activities.filter(
      (act) => act.visibility === "public"
    );

    const userCounts = users.map((user) => {
      const count = publicActivities.filter(
        (act) => act.user_id === user.id
      ).length;
      return { ...user, publicActivitiesCount: count };
    });

    const sorted = userCounts
      .sort((a, b) => b.publicActivitiesCount - a.publicActivitiesCount)
      .slice(0, 5);

    setTopUsers(sorted);
  }, [activities, users]);

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
                    <strong>{act.title}</strong> – {act.favorites_count} veces
                    guardada
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
