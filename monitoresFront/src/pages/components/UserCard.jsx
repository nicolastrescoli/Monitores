import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function UserCard({ user }) {
  const { currentUser, sendFriendRequest, cancelRequest, acceptRequest, rejectRequest, removeFriend, friendStatusWith } =
    useContext(AuthContext);

  // Estado para simular cambios de status
  const [status, setStatus] = useState(friendStatusWith(user));

  const handleRequest = () => {
    sendFriendRequest(user);
    setStatus("pending_sent");
  };

  const handleCancel = () => {
    cancelRequest(user);
    setStatus(null);
  };

  const handleAccept = () => {
    acceptRequest(user);
    setStatus("friends");
  };

  const handleReject = () => {
    rejectRequest(user);
    setStatus(null);
  };

  const handleRemove = () => {
    removeFriend(user);
    setStatus(null);
  };

  return (
    <div className="col-md-12 mb-3">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{user.name}</h5>
          <p className="card-text">{user.email}</p>

          {status === "friends" && (
            <>
              <span className="badge bg-success">Amigos</span>
              <button className="btn btn-sm btn-danger ms-2" onClick={handleRemove}>
                Eliminar amistad
              </button>
            </>
          )}

          {status === "pending_sent" && (
            <>
              <span className="badge bg-warning text-dark">Solicitud enviada</span>
              <button className="btn btn-sm btn-secondary ms-2" onClick={handleCancel}>
                Cancelar solicitud
              </button>
            </>
          )}

          {status === "pending_received" && (
            <>
              <button className="btn btn-sm btn-success me-2" onClick={handleAccept}>
                Aceptar
              </button>
              <button className="btn btn-sm btn-danger" onClick={handleReject}>
                Rechazar
              </button>
            </>
          )}

          {!status && (
            <button className="btn btn-sm btn-primary" onClick={handleRequest}>
              Enviar solicitud
            </button>
          )}

          <div className="mt-2">
            <Link to={`/profile/${user.id}`} className="btn btn-outline-primary btn-sm">
              Ver perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
