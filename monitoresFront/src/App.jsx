import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Login from "./pages/login-register/Login";
import Register from "./pages/login-register/Register";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { AuthContext } from "./contexts/AuthContext";
import ActivityDetailWrapper from "./wrappers/ActivityDetailWrapper";
import axios from "axios";
import ActivityForm from "./pages/create-edit-forms/ActivityForm";
import ScheduleBuilder from "./pages/schedules/ScheduleBuilder";

function Community() {
  return (
    <div className="container py-5">
      <h2>Comunidad</h2>
      <p>Lista de usuarios y organizaciones.</p>
    </div>
  );
}

// 🔒 Rutas privadas
function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  const { user, setUser } = useContext(AuthContext);

  // Cargar usuario desde token
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
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/community" element={<Community />} />

          {/* Private pages */}
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

          <Route path="/activities/create" element={
              <PrivateRoute>
                <ActivityForm />
              </PrivateRoute>
            }
          />

          <Route path="/activities/:id/edit" element={
              <PrivateRoute>
                <ActivityForm />
              </PrivateRoute>
            }
          />

          {/* Activity detail */}
          <Route
            path="/activities/:id"
            element={<ActivityDetailWrapper />}
          />

          <Route path="/schedule/create" element={
              <PrivateRoute>
                <ScheduleBuilder />
              </PrivateRoute>
            }
          />

          <Route path="/schedule/:id/edit" element={
              <PrivateRoute>
                <ScheduleBuilder />
              </PrivateRoute>
            }
          />

          {/* Activity detail */}
          <Route
            path="/activities/:id"
            element={<ActivityDetailWrapper />}
          />

        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
