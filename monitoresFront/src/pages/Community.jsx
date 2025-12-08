import { useSelector, useDispatch } from "react-redux";
import UserCard from "./components/UserCard";
import {
  acceptFriendRequest,
  rejectFriendRequest
} from "../redux/features/communitySlice";

export default function Community() {
  const dispatch = useDispatch();

  const { loggedUser } = useSelector((state) => state.auth);
  const { users, loading } = useSelector((state) => state.community);

  // Filtrar usuarios y organizaciones que no sean el propio usuario
  const usersList = users.filter(
    (u) => u.role === "user" && u.id !== loggedUser?.id
  );
  const organizationsList = users.filter(
    (u) => u.role === "organization" && u.id !== loggedUser?.id
  );

  if (loading || !users) {
    return <div className="container py-5">Cargando usuarios...</div>;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Comunidad</h1>
      <div className="row justify-content-center">
        <h3>Solicitudes pendientes</h3>
        {usersList.filter((otherUser) => otherUser.friend_status === "pending_received").length === 0 
        ? (<div className="alert alert-info">No hay solicitudes pendientes.</div>)
        : (
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
                    <button className="btn btn-sm btn-success me-2" onClick={() => dispatch(acceptFriendRequest(otherUser.id))}>
                      Aceptar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => dispatch(rejectFriendRequest(otherUser.id))}>
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
