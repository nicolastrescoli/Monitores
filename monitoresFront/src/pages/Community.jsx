import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import UserCard from "./components/UserCard";
import { getUsers } from "../services/api";

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

  return (
    <div className="container py-5">
      <h1 className="mb-4">Comunidad</h1>

      <div className="row">
        {/* Usuarios */}
        <div className="col-md-6">
          <h3>Usuarios</h3>
          <div className="row">
            {usersList.length === 0 ? (
              <p>No hay usuarios disponibles.</p>
            ) : (
              usersList.map((otherUser) => (
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
              organizationsList.map((otherUser) => (
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
