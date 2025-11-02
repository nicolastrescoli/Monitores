import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import ActivityCard from "../components/ActivityCard";
import { Link } from "react-router-dom";

export default function Profile({ user, activities, favoriteActivities, schedules, contacts }) {
  const { user: currentUser } = useContext(AuthContext);
  const isOwner = currentUser?.name === user.name;

  // Filtrar favoritas (no propias y solo públicas)
  const favoritas = favoriteActivities.filter(
    (activity) => activity.creatorId !== user.id && activity.visibility === "public"
  );

  return (
    <div className="container py-5 d-flex">
      <div className="row justify-content-between col-md-9">
        <div>
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                {isOwner ? "Mi Perfil" : `Perfil de ${user.name}`}
              </h4>
              {/* Botón de editar si quieres */}
              {/* {isOwner && <Link className="btn btn-sm btn-outline-light">Editar</Link>} */}
            </div>

            <div className="card-body bg-light text-dark">
              <div className="row mb-3">
                <div className="col-md-4 text-center">
                  <img
                    src={user.avatar || "https://placehold.co/150"}
                    className="rounded-circle img-thumbnail mb-2"
                    alt="Avatar"
                    style={{ width: 150, height: 150 }}
                  />
                </div>
                <div className="col-md-8">
                  <p><strong>Nombre:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Descripción:</strong> {user.description || "Empieza a escribir tu descripción"}</p>
                  <p><strong>Registrado desde:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

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

              {/* Mis actividades */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Mis actividades</h5>
                {isOwner && (
                  <div className="d-flex gap-2">
                    <Link to="/activities/create" className="btn btn-success btn-sm">
                      Nueva actividad
                    </Link>
                  </div>
                )}
              </div>

              {activities.length === 0 ? (
                <div className="alert alert-info">Aún no has creado ninguna actividad.</div>
              ) : (
                <div className="row gy-4 mb-5">
                  {activities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              )}

              <hr />

              {/* Actividades favoritas */}
              <h5 className="mb-3">Mis actividades guardadas (favoritos)</h5>
              {favoritas.length === 0 ? (
                <div className="alert alert-info">Aún no has añadido ninguna actividad a favoritos.</div>
              ) : (
                <div className="row gy-4 mb-5">
                  {favoritas.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              )}

              <hr />

              {/* Mis programaciones */}
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
      </div>

      {/* Contactos */}
      <div className="col-md-3">
        <h2>Contactos</h2>
        <hr />
        <div className="row">
          {contacts.map((contact) => (
            <div key={contact.id} className="card h-100 mb-3">
              <div className="card-body">
                <h5 className="card-title">{contact.name}</h5>
                <Link to={`/community/${contact.id}`}>Ver perfil</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
