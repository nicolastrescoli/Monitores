import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ActivityCard from "../components/ActivityCard.jsx";
import { deleteSchedule } from "../../services/api.js";
import { Contacts } from "./components/Contacts.jsx";
import { getProfile, updateUser } from "../../services/api.js";
import { RemoveFriend } from "../components/buttons/removeFriend.jsx";

export default function Profile() {
  const { id } = useParams(); // id pasada en la URL
  const [externalProfile, setExternalProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [url_image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    user: currentUser,
    profileData,
    fetchProfile,
  } = useContext(AuthContext);

useEffect(() => {
  const fetch = async () => {
    setLoading(true);   
    try {
      if (id) {
        const data = await getProfile(id);
        setExternalProfile(data);
      } else {
        setExternalProfile(null);
      }
    } catch {
      setExternalProfile(null);
    } finally {
      setLoading(false);
    }
  };

  fetch();
}, [id]);

  const dataToShow = id ? externalProfile : profileData;

  if (loading) {
    return (
      <div className="alert">Loading...</div>
    );
  }

  if (!dataToShow) {
    return (
      <div className="alert alert-danger">No se pudo cargar el perfil.</div>
    );
  }

  const { user, favoriteActivities, schedules, contacts } = dataToShow;

  const created = favoriteActivities.filter((act) => act.user_id === user.id);
  const joined = favoriteActivities.filter((act) => act.user_id !== user.id);

  const isOwner = !id; // si NO hay id → es tu perfil

  function startEditing() {
  setName(user.name || "");
  setEmail(user.email || "");
  setDescription(user.description || "");
  setImage(user.url_image || "");
  setPassword("");
  setConfirmPassword("");
  setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setName("");
    setEmail("");
    setDescription("");
    setImage("");
    setPassword("");
    setConfirmPassword("");
  }

async function handleUpdateUser() {
  await updateUser(
    user.id,
    name,
    description,
    email,
    password,
    confirmPassword,
    url_image
  );

  // Recarga datos del perfil
  await fetchProfile();

  setIsEditing(false);
}

  // --- ELIMINAR PROGRAMACIÓN ---
  async function handleDeleteSchedule(scheduleId) {
    try {
      await deleteSchedule(scheduleId);
      await fetchProfile(); // 🔹 recarga profileData automáticamente
    } catch (err) {
      console.error(err);
      alert("Error al eliminar programación");
    }
  }

  return (
    <div className="container py-4 d-flex flex-wrap flex-lg-nowrap gap-4">
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
            <>
              <div className="row mb-3 align-items-center">
                <div className="col-md-3 text-center">
                  <img
                    src={user.url_image || "https://placehold.co/150"}
                    className="rounded-circle img-thumbnail mb-2"
                    alt="Avatar"
                    style={{ width: 200, height: 200 }}
                  />
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Nombre:</strong> {!isEditing ? (user.name) : (<input type="text" value={name} onChange={(e) => setName(e.target.value)}/>)}
                  </p>
                  <p>
                    <strong>Email:</strong> {!isEditing ? (user.email) : (<input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>)}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {!isEditing ? (user.description) : (<input type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>)}
                  </p>
                  {!isEditing ? (
                    <>
                    <p>
                      <strong>Registrado desde:</strong> {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    {isOwner ? (
                      <Link
                        to="/community"
                        className="btn btn-outline-primary mt-2"
                      >
                        Encontrar Usuarios / Organizaciones
                      </Link>
                    ) : (
                      <RemoveFriend
                        otherUserId={user.id}
                        text={"Eliminar contacto"}
                      />
                    )}
                  </>
                    ) : (
                    <>
                      <p>
                        <strong>Nueva contraseña: </strong>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                      </p>
                      <p>
                        <strong>Repita nueva contraseña: </strong>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                      </p>
                        <p>
                        <strong>URL imagen: </strong>
                        <input type="text" value={url_image} onChange={(e) => setImage(e.target.value)}/>
                      </p>
                    </>
                    )}

                </div>
                <div className="col-md-3 d-flex">
                  {!isEditing ? (
                    <>
                      <button className="btn btn-warning border-dark me-2" onClick={startEditing}>Editar Perfil</button>
                      <button className="btn btn-danger border-dark">Eliminar Cuenta</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-success border-dark" onClick={handleUpdateUser}>Guardar cambios</button>
                      <button className="btn btn-danger border-dark me-2" onClick={cancelEditing}>Cancelar Edicion</button>
                    </>
                  )}
                </div>
              </div>
            </>

            <hr />

            {/* MIS ACTIVIDADES */}
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  {isOwner ? "Mis Actividades" : `Actividades de ${user.name}`}
                </h5>
                {isOwner && (
                  <Link
                    to="/activities/create"
                    className="btn btn-success btn-sm"
                  >
                    Nueva actividad
                  </Link>
                )}
              </div>

              {created.length === 0 ? (
                <div className="alert alert-info">
                  Aún no has creado ninguna actividad.
                </div>
              ) : (
                <div className="row gy-4 mb-5">
                  {created.map((activity) => (
                    <div className="col-md-4" key={activity.id}>
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                    />
                    </div>
                  ))}
                </div>
              )}
            </>

            {/* FAVORITOS */}
            {isOwner && (
              <>
                <hr />
                <h5 className="mb-3">Mis Actividades Favoritas</h5>
                {joined.length === 0 ? (
                  <div className="alert alert-info">
                    Aún no has añadido ninguna actividad a favoritos.
                  </div>
                ) : (
                  <div className="row gy-4 mb-5">
                    {joined.map((activity) => (
                      <div className="col-md-4" key={activity.id}>
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        currentUserId={currentUser?.id}
                        userJoinedActivities={joined.map((fav) => fav.id)}
                      />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            <hr />

            {/* PROGRAMACIONES */}
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-3">
                  {isOwner
                    ? "Mis Programaciones"
                    : `Programaciones de ${user.name}`}
                </h5>
                {isOwner && (
                  <Link
                    to="/schedule/create"
                    className="btn btn-success btn-sm"
                    state={{ favoriteActivities }}
                  >
                    Nueva Programación
                  </Link>
                )}
              </div>

              {schedules.length === 0 ? (
                <div className="alert alert-info">
                  Aún no has creado ninguna programación.
                </div>
              ) : (
                <>
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="col-md-12 mb-1">
                      <div className="card">
                        <div className="card-body d-flex justify-content-between align-items-center py-1">
                          <Link to={`/schedule/${schedule.id}`} state={{ favoriteActivities }}>
                            <div className="d-flex justify-content-between align-items-center">
                              <strong className="card-title">
                                {schedule.name}
                              </strong>
                            </div>
                          </Link>
                          {isOwner && (
                          <>
                          <div>
                            <button className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                            >Eliminar
                            </button>
                          </div>
                          </>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          </div>
        </div>
      </div>

      {/* CONTACTOS */}
      {isOwner && <Contacts contacts={contacts} />}
    </div>
  );
}
