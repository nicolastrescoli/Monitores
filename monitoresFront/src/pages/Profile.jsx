import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import ActivityCard from "../components/ActivityCard";
import axios from "axios";

export default function Profile() {
  const { user: currentUser, token } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(res.data);
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) return <div className="text-center py-5">Cargando perfil...</div>;
  if (!profileData) return <div className="alert alert-danger">No se pudo cargar el perfil.</div>;

  const { user, favoriteActivities, schedules, contacts } = profileData;
  
  const created = favoriteActivities.filter(act => act.user_id === currentUser?.id);
  const joined = favoriteActivities.filter(act => act.user_id !== currentUser?.id);

  const isOwner = currentUser?.id === user.id;

  return (
    <div className="container py-5 d-flex flex-wrap flex-lg-nowrap gap-4">
      {/* PERFIL PRINCIPAL */}
      <div className="flex-grow-1">
        <div className="card shadow border-0">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              {isOwner ? "Mi Perfil" : `Perfil de ${user.name}`}
            </h4>
          </div>

          <div className="card-body bg-light text-dark">
            {/* Información básica */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-4 text-center">
                <img
                  src={user.url_image || "https://placehold.co/150"}
                  className="rounded-circle img-thumbnail mb-2"
                  alt="Avatar"
                  style={{ width: 150, height: 150 }}
                />
              </div>
              <div className="col-md-8">
                <p><strong>Nombre:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Descripción:</strong> {user.description || "Empieza a escribir tu descripción"}</p>
                <p><strong>Registrado desde:</strong> {new Date(user.created_at).toLocaleDateString()}</p>

                {isOwner ? (
                  <Link to="/community" className="btn btn-outline-primary mt-2">
                    Encontrar Usuarios / Organizaciones
                  </Link>
                ) : (
                  <button className="btn btn-outline-danger mt-2">
                    Eliminar contacto
                  </button>
                )}
              </div>
            </div>

            <hr />

            {/* MIS ACTIVIDADES */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Mis actividades</h5>
              {isOwner && (
                <Link to="/activities/create" className="btn btn-success btn-sm">
                  Nueva actividad
                </Link>
              )}
            </div>

            {created.length === 0 ? (
              <div className="alert alert-info">Aún no has creado ninguna actividad.</div>
            ) : (
              <div className="row gy-4 mb-5">
                {created.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} 
                  currentUserId={currentUser?.id} 
                  />
                ))}
              </div>
            )}

            <hr />

            {/* FAVORITOS */}
            <h5 className="mb-3">Mis actividades guardadas (favoritos)</h5>
            {joined.length === 0 ? (
              <div className="alert alert-info">Aún no has añadido ninguna actividad a favoritos.</div>
            ) : (
              <div className="row gy-4 mb-5">
                {joined.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} 
                  currentUserId={currentUser?.id} userJoinedActivities={joined.map(fav => fav.id)}
                  />
                ))}
              </div>
            )}

            <hr />

            {/* PROGRAMACIONES */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-3">Mis programaciones</h5>
              {isOwner && (
                <Link to="/schedule/create" className="btn btn-success btn-sm">
                  Nueva Programación
                </Link>
              )}
            </div>

            {schedules.length === 0 ? (
              <div className="alert alert-info">Aún no has creado ninguna programación.</div>
            ) : (
              <ul id="schedule-list">
                {schedules.map((schedule) => (
                  <li key={schedule.id} id={`schedule-${schedule.id}`}>
                    <Link to={`/schedule/${schedule.id}`}>{schedule.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* CONTACTOS */}
      <div className="col-lg-3 col-md-12">
        <div className="card shadow border-0">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">Contactos</h5>
          </div>
          <div className="card-body">
            {contacts.length === 0 ? (
              <div className="alert alert-info">Aún no tienes contactos.</div>
            ) : (
              <div className="row">
                {contacts.map((contact) => (
                  <div key={contact.id} className="col-12 mb-3">
                    <div className="card border-light shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="card-title mb-1">{contact.name}</h6>
                        <Link to={`/community/${contact.id}`} className="btn btn-outline-dark btn-sm mt-2">
                          Ver perfil
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
