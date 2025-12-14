import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ActivityCard from "../components/ActivityCard.jsx";
import { deleteSchedule } from "../../services/api.js";
import { Contacts } from "./components/Contacts.jsx";

import { fetchUser } from "../../redux/features/userSlice.js";
import { fetchLoggedUser, updateLoggedUser } from "../../redux/features/authSlice.js";
import DeleteModal from "../components/DeleteModal.jsx";
import { OrbitProgress } from "react-loading-indicators";

export default function Profile() {
  const dispatch = useDispatch();
  const { id } = useParams(); // Perfil de otro usuario

  const { loggedUser, loading: authLoading } = useSelector((state) => state.auth);
  const { user: externalUser, loading: userLoading } = useSelector((state) => state.user);

  const [localLoading, setLocalLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [url_image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Cargar perfil
  useEffect(() => {
    const fetchData = async () => {
      setLocalLoading(true);
      try {
        if (id) {
          await dispatch(fetchUser(id)).unwrap();
        } else if (!loggedUser) {
          await dispatch(fetchLoggedUser()).unwrap();
        }
      } catch {
        // Error manejado abajo
      } finally {
        setLocalLoading(false);
      }
    };
    fetchData();
  }, [id, dispatch]);

  const dataToShow = id ? externalUser : loggedUser;

  if (authLoading || userLoading || localLoading) {
    return (
      <div className="text-center">
        <OrbitProgress dense color="#32cd32" size="medium" text="" textColor="" />
        <div className="container py-5">Cargando...</div>
      </div>
    )
  }

  if (!dataToShow) {
    return <div className="alert alert-danger">No se pudo cargar el perfil.</div>;
  }

  const { favoriteActivities = [], schedules = [], contacts = [] } = dataToShow;
  const isOwner = !id;

  const created = favoriteActivities.filter((act) => act.user_id === dataToShow.id);
  const joined = favoriteActivities.filter((act) => act.user_id !== dataToShow.id);

  // Funciones de edición
  function startEditing() {
    setName(dataToShow.name || "");
    setEmail(dataToShow.email || "");
    setDescription(dataToShow.description || "");
    setImage(dataToShow.url_image || "");
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
    const formData = {
      id: dataToShow.id,
      name,
      description,
      email,
      url_image,
      ...(password ? { password, password_confirmation: confirmPassword } : {}),
    };
    await dispatch(updateLoggedUser(formData)).unwrap();
    setIsEditing(false);
  }

  async function handleDeleteSchedule(scheduleId) {
    try {
      await deleteSchedule(scheduleId);
      await dispatch(fetchLoggedUser()).unwrap();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar programación");
    }
  }

  return (
    <div className="container py-3 d-flex flex-wrap flex-lg-nowrap gap-4">
      {/* PERFIL */}
      <div className="flex-grow-1">
        <div className="card shadow border-0">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              {isOwner ? "Mi Perfil" : `Perfil de ${dataToShow.name}`}
            </h4>
          </div>

          <div className="card-body bg-light text-dark">
            {/* Información básica */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-3 text-center">
                <img
                  src={dataToShow.url_image || "https://placehold.co/150"}
                  className="rounded-circle img-thumbnail mb-2"
                  alt="Avatar"
                  style={{ width: 200, height: 200 }}
                />
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Nombre:</strong>{" "}
                  {!isEditing ? (
                    dataToShow.name
                  ) : (
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  )}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {!isEditing ? (
                    dataToShow.email
                  ) : (
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  )}
                </p>
                <p>
                  <strong>Descripción:</strong>{" "}
                  {!isEditing ? (
                    dataToShow.description
                  ) : (
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                  )}
                </p>
                {!isEditing && isOwner ? (
                  <Link to="/community" className="btn btn-outline-primary mt-2">
                    Encontrar Usuarios / Organizaciones
                  </Link>
                ) :
                (
                  <>
                    <strong>Profile image:</strong>{" "}
                    <input type="text" value={url_image} onChange={(e) => setImage(e.target.value)} />
                  </>
                )
                }
              </div>

              {/* Botones edición */}
              {isOwner && (
                <div className="col-md-3 d-flex justify-content-end align-self-start">
                  {!isEditing ? (
                    <>
                      <button className="btn btn-sm btn-warning mb-2" onClick={startEditing}>Editar Perfil</button>
                      <button className="btn btn-sm btn-danger mb-2 ms-2" >Eliminar Cuenta</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-sm btn-success mb-2" onClick={handleUpdateUser}>Guardar cambios</button>
                      <button className="btn btn-sm btn-danger ms-2 mb-2" onClick={cancelEditing}>Cancelar</button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Actividades y Favoritos */}
            <hr />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>{isOwner ? "Mis Actividades" : `Actividades de ${dataToShow.name}`}</h5>
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
              <div className="alert alert-info">No hay actividades creadas.</div>
            ) : (
              <div className="row gy-4 mb-5">
                {created.map((activity) => (
                  <div className="col-md-4" key={activity.id}>
                    <ActivityCard id={activity.id} />
                  </div>
                ))}
              </div>
            )}

            {isOwner && (
              <>
                <h5>Favoritos</h5>
                {joined.length === 0 ? (
                  <div className="alert alert-info">No hay actividades favoritas.</div>
                ) : (
                  <div className="row gy-4 mb-5">
                    {joined.map((activity) => (
                      <div className="col-md-4" key={activity.id}>
                        <ActivityCard id={activity.id} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Programaciones */}
            <hr />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>{isOwner ? "Mis Programaciones" : `Programaciones de ${dataToShow.name}`}</h5>
              {isOwner && (
                  <Link
                    to="/schedule/create"
                    className="btn btn-success btn-sm"
                    state={{ favoriteActivities }}
                  >
                    Nueva programación
                  </Link>
                )}
            </div>
            {schedules.length === 0 ? (
              <div className="alert alert-info">No hay programaciones.</div>
            ) : (
              schedules.map((schedule) => (
                <div key={schedule.id} className="col-md-12 mb-1">
                  <div className="card">
                    <div className="card-body d-flex justify-content-between align-items-center py-2">
                      <Link to={`/schedule/${schedule.id}`} state={{ favoriteActivities }}>
                        <strong>{schedule.name}</strong>
                      </Link>
                      {isOwner && (
                        <DeleteModal 
                          buttonText={"Eliminar"}
                          modalText={"¿Seguro que deseas eliminar esta programación?"}
                          deleteMethod={() => handleDeleteSchedule(schedule.id)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Contactos */}
      {isOwner && <Contacts contacts={contacts} />}
    </div>
  );
}
