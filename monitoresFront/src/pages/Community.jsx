import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import UserCard from "./components/UserCard";
import { getUsers, acceptRequest, rejectRequest } from "../services/api";

export default function Community() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch de usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.users || []);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrar usuarios y organizaciones
  const usersList = users.filter(
    (u) => u.role === "user" && u.id !== currentUser?.id
  );
  const organizationsList = users.filter(
    (u) => u.role === "organization" && u.id !== currentUser?.id
  );

  if (loading) {
    return <div className="container py-5">Cargando usuarios...</div>;
  }

  async function handleAcceptRequest(otherUserId) {
    try {
      await acceptRequest(otherUserId);
    } catch (err) {
      console.error(err);
      alert("Error al aceptar solicitud");
    }
  };

  async function handleRejectRequest(otherUserId) {
    try {
      await rejectRequest(otherUserId);
    } catch (err) {
      console.error(err);
      alert("Error al rechazar solicitud");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Comunidad</h1>
      <div className="row">
        <h3>Solicitudes pendientes</h3>
        {usersList.length === 0 ? (
          <p>No hay solicitudes pendientes.</p>
        ) : (
          usersList
          .filter((otherUser) => otherUser.friend_status === "pending_received")
          .map((otherUser) => (
            <div key={otherUser.id} className="col-md-12 mb-1">
              <div className="card">
                <div className="card-body d-flex justify-content-between align-items-center py-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="card-title col-6">{otherUser.name}</strong>
                    <small className="card-text">{otherUser.email}</small>
                  </div>
                  <div>
                    <button className="btn btn-sm btn-success me-2" onClick={() => handleAcceptRequest(otherUser.id)}>
                      Aceptar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleRejectRequest(otherUser.id)}>
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="row">
        {/* Usuarios */}
        <div className="col-md-6">
          <h3>Usuarios</h3>
          <div className="row">
            {usersList.length === 0 ? (
              <p>No hay usuarios disponibles.</p>
            ) : (
              usersList
              .filter((otherUser) => otherUser.friend_status !== "pending_received")
              .map((otherUser) => (
                <div key={otherUser.id} className="col-12 mb-3">
                  <UserCard otherUser={otherUser} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Organizaciones */}
        <div className="col-md-6">
          <h3>Organizaciones</h3>
          <div className="row">
            {organizationsList.length === 0 ? (
              <p>No hay organizaciones disponibles.</p>
            ) : (
              organizationsList
              .filter((otherUser) => otherUser.friend_status !== "pending_received")
              .map((otherUser) => (
                <div key={otherUser.id} className="col-12 mb-3">
                  <UserCard otherUser={otherUser} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
