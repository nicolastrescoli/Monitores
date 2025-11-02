import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useContext } from "react";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { AuthContext } from "./contexts/AuthContext";
import ActivityDetailWrapper from "./wrappers/ActivityDetailWrapper";

function Community() {
  return (
    <div className="container py-5">
      <h2>Comunidad</h2>
      <p>Lista de usuarios y organizaciones.</p>
    </div>
  );
}

// Componente para rutas privadas
function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />; // No logueado
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />; // Rol no permitido
  return children;
}

// Datos simulados
const dummyUsers = [
  { id: 1, name: "Alice", email: "alice@example.com", avatar: "", description: "Monitor", createdAt: "2023-01-01" },
  { id: 2, name: "Bob", email: "bob@example.com", avatar: "", description: "Organización", createdAt: "2023-03-15" },
];

const dummyActivities = [
  { id: 1, nombre: "Carrera de Sacos", tipo: "Actividad Física", edad: 8, participantes: 10, puntuacion: 5, creatorId: 1, visibility: "public" },
  { id: 2, nombre: "Pintura con Acuarelas", tipo: "Manualidad", edad: 6, participantes: 5, puntuacion: 4, creatorId: 2, visibility: "public" },
];

export default function App() {
  const { user: currentUser } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:id" element={<ProfileWrapper />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* Panel de administración */}
          <Route
            path="/activities/pending"
            element={
              <PrivateRoute roles={["admin"]}>
                <div className="container py-5">
                  <h2>Panel de Administración</h2>
                  <p>Aquí irían las actividades pendientes.</p>
                </div>
              </PrivateRoute>
            }
          />
          <Route path="/activities/:id" element={<ActivityDetailWrapper />} />
        </Route>

        {/* Redirección para rutas desconocidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Wrapper para pasar datos simulados a Profile usando useParams
function ProfileWrapper() {
  const { id } = useParams();
  const userId = parseInt(id);
  const user = dummyUsers.find((u) => u.id === userId) || dummyUsers[0];

  const activities = dummyActivities.filter((a) => a.creatorId === user.id);
  const favoriteActivities = dummyActivities;
  const schedules = [];
  const contacts = dummyUsers.filter((u) => u.id !== user.id);

  return (
    <Profile
      user={user}
      activities={activities}
      favoriteActivities={favoriteActivities}
      schedules={schedules}
      contacts={contacts}
    />
  );
}
