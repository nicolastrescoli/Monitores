// import UserCard from "../components/UserCard";
// import { useContext } from "react";
// import { AuthContext } from "../contexts/AuthContext";

// // Ejemplo de usuarios simulados
// const dummyUsers = [
//   { id: 1, name: "Alice", role: "user", description: "Monitor de actividades" },
//   { id: 2, name: "Bob", role: "organization", description: "Organización educativa" },
//   { id: 3, name: "Charlie", role: "user", description: "Monitor creativo" },
// ];

export default function Community() {
  // const { user: currentUser } = useContext(AuthContext);

  // const usersWithoutMe = dummyUsers.filter((u) => u.id !== currentUser?.id);

  // const users = usersWithoutMe.filter((u) => u.role === "user");
  // const organizations = usersWithoutMe.filter((u) => u.role === "organization");

  return (
    // <div className="container py-5">
    //   <h1 className="mb-4">Comunidad</h1>

    //   <div className="row">
    //     {/* Usuarios */}
    //     <div className="col-md-6">
    //       <h3>Usuarios</h3>
    //       <div className="row">
    //         {users.map((u) => (
    //           <UserCard key={u.id} user={u} />
    //         ))}
    //       </div>
    //     </div>

    //     {/* Organizaciones */}
    //     <div className="col-md-6">
    //       <h3>Organizaciones</h3>
    //       <div className="row">
    //         {organizations.map((o) => (
    //           <UserCard key={o.id} user={o} />
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </div>
        <div className="container py-5">
      <h2>Comunidad</h2>
      <p>Lista de usuarios y organizaciones.</p>
    </div>
  );
}
