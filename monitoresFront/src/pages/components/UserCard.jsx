import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { sendRequest } from "../../services/api";

export default function UserCard({ otherUser }) {
  const { user: currentUser, fetchProfile } = useContext(AuthContext);

  // Estado local de la relación de amistad
  const [status, setStatus] = useState(otherUser.friend_status || "none");

  const handleSendRequest = async () => {
    try {
      await sendRequest(otherUser.id);
      setStatus("pending_sent");
    } catch (err) {
      console.error(err);
      alert("Error al enviar solicitud");
    }
  };

  // const handleCancelRequest = async () => {
  //   try {
  //     await cancelFriendRequest(otherUser.id);
  //     setStatus("none");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error al cancelar solicitud");
  //   }
  // };

  // const handleAcceptRequest = async () => {
  //   try {
  //     await acceptFriendRequest(otherUser.id);
  //     setStatus("friends");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error al aceptar solicitud");
  //   }
  // };

  // const handleRejectRequest = async () => {
  //   try {
  //     await rejectFriendRequest(otherUser.id);
  //     setStatus("none");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error al rechazar solicitud");
  //   }
  // };

  // const handleRemoveFriend = async () => {
  //   try {
  //     await removeFriend(otherUser.id);
  //     setStatus("none");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error al eliminar amistad");
  //   }
  // };

  return (
    <div className="col-md-12 mb-3">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{otherUser.name}</h5>
          <p className="card-text">{otherUser.email}</p>

          {status === "friends" && (
            <>
              <span className="badge bg-success">Amigos</span>
              <button className="btn btn-sm btn-danger ms-2" >
                Eliminar amistad
              </button>
            </>
          )}

          {status === "pending_sent" && (
            <>
              <span className="badge bg-warning text-dark">Solicitud enviada</span>
              <button className="btn btn-sm btn-secondary ms-2" >
                Cancelar solicitud
              </button>
            </>
          )}

          {status === "pending_received" && (
            <>
              <button className="btn btn-sm btn-success me-2" >
                Aceptar
              </button>
              <button className="btn btn-sm btn-danger" >
                Rechazar
              </button>
            </>
          )}

          {status === "none" && (
            <button className="btn btn-sm btn-primary" onClick={() => handleSendRequest}>
              Enviar solicitud
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
