import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Login from "./pages/login-register/Login";
import Register from "./pages/login-register/Register";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Community from "./pages/Community";
import AdminPanel from "./pages/AdminPanel.jsx";
import { AuthContext } from "./contexts/AuthContext";
import ActivityDetailWrapper from "./wrappers/ActivityDetailWrapper";
import ActivityForm from "./pages/create-edit-forms/ActivityForm";
import ScheduleBuilder from "./pages/schedules/ScheduleBuilder";
import { getActivities } from "./services/api.js";

function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  // const { user, setUser } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // // Cargar usuario desde token
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //     axios
  //       .get("/api/user")
  //       .then((res) => setUser(res.data))
  //       .catch(() => {
  //         localStorage.removeItem("token");
  //         delete axios.defaults.headers.common["Authorization"];
  //       });
  //   }
  // }, [setUser]);

  useEffect(() => {
    fetchActivities().catch((err) => {
      console.error("Error cargando actividades:", err);
      setLoading(false);
    });
  }, []);

  const fetchActivities = async () => {
    const data = await getActivities();
    setActivities(data);
    setLoading(false);
  };

  if (loading)
    return <div className="container py-5">Cargando actividades...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public pages */}
          <Route
            path="/"
            element={
              <Home activities={activities} setActivities={setActivities} />
            }
          />
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

          {/* <Route path="/profile/:id" element={
              <PrivateRoute>
                <Profile/>
              </PrivateRoute>
            }
          /> */}

          <Route
            path="/activities/pending"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminPanel />
              </PrivateRoute>
            }
          />

          <Route
            path="/activities/create"
            element={
              <PrivateRoute>
                <ActivityForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/activities/:id/edit"
            element={
              <PrivateRoute>
                <ActivityForm />
              </PrivateRoute>
            }
          />

          {/* Activity detail */}
          <Route path="/activities/:id" element={<ActivityDetailWrapper />} />

          <Route
            path="/schedule/create"
            element={
              <PrivateRoute>
                <ScheduleBuilder />
              </PrivateRoute>
            }
          />

          <Route
            path="/schedule/:id/edit"
            element={
              <PrivateRoute>
                <ScheduleBuilder />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
