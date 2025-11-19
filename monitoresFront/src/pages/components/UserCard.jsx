import {  useState } from "react";
import { sendRequest, cancelRequest, removeFriend } from "../../services/api";

export default function UserCard({ otherUser }) {

  // Estado local de la relación de amistad
  const [status, setStatus] = useState(otherUser.friend_status || "none");

  const handleSendRequest = async (otherUserId) => {
    try {
      await sendRequest(otherUserId);
      setStatus("pending_sent");
    } catch (err) {
      console.error(err);
      alert("Error al enviar solicitud");
    }
  };

  const handleCancelRequest = async (otherUserId) => {
    try {
      await cancelRequest(otherUserId);
      setStatus("none");
    } catch (err) {
      console.error(err);
      alert("Error al cancelar solicitud");
    }
  };

  const handleRemoveFriend = async (otherUserId) => {
    try {
      await removeFriend(otherUserId);
      setStatus("none");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar amistad");
    }
  };

  return (
    <div className="col-md-12 mb-3">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{otherUser.name}</h5>
          <p className="card-text">{otherUser.email}</p>

          {status === "friends" && (
            <>
              <span className="badge bg-success">Amigos</span>
              <button className="btn btn-sm btn-danger ms-2" onClick={() => handleRemoveFriend(otherUser.id)}>
                Eliminar amistad
              </button>
            </>
          )}

          {status === "pending_sent" && (
            <>
              <span className="badge bg-warning text-dark">Solicitud enviada</span>
              <button className="btn btn-sm btn-secondary ms-2" onClick={() => handleCancelRequest(otherUser.id)}>
                Cancelar solicitud
              </button>
            </>
          )}

          {status === "none" && (
            <button className="btn btn-sm btn-primary" onClick={() => handleSendRequest(otherUser.id)}>
              Enviar solicitud
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
