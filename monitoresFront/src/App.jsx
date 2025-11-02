import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { AuthContext } from "./contexts/AuthContext";
import ActivityDetailWrapper from "./wrappers/ActivityDetailWrapper";
import axios from "axios";

function Community() {
  return (
    <div className="container py-5">
      <h2>Comunidad</h2>
      <p>Lista de usuarios y organizaciones.</p>
    </div>
  );
}

// 🔒 Componente para rutas privadas
function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />; // No logueado
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />; // Rol no permitido
  return children;
}

export default function App() {
  const { user, setUser } = useContext(AuthContext);

  // ✅ Verifica si hay token y carga el usuario al iniciar la app
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("/api/user")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        });
    }
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/community" element={<Community />} />

          {/* Privadas */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
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

          {/* Actividades */}
          <Route path="/activities/:id" element={<ActivityDetailWrapper />} />
        </Route>

        {/* Redirección para rutas desconocidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
