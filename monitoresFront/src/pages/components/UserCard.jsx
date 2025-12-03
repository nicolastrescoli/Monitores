import { useState } from "react";
import { RemoveFriend } from "./buttons/removeFriend";
import { SendRequest } from "./buttons/SendRequest";
import { CancelRequest } from "./buttons/CancelRequest";

export default function UserCard({ otherUser }) {
  // Estado local de la relación de amistad para ver el cambio sin recargar
  const [status, setStatus] = useState(otherUser.friend_status || "none");

  return (
    <div className="col-md-12 mb-3">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{otherUser.name}</h5>
          <p className="card-text">{otherUser.email}</p>

          {status === "friends" && (
            <>
              <span className="badge bg-success me-2">Amigos</span>
              <RemoveFriend otherUserId={otherUser.id} setStatus={setStatus} />
            </>
          )}

          {status === "pending_sent" && (
            <>
              <span className="badge bg-warning text-dark me-2">Solicitud enviada</span>
              <CancelRequest otherUserId={otherUser.id} setStatus={setStatus} />
            </>
          )}

          {status === "none" && (
            <SendRequest otherUserId={otherUser.id} setStatus={setStatus} />
          )}
        </div>
      </div>
    </div>
  );
}
