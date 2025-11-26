import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Login from "./pages/login-register/Login";
import Register from "./pages/login-register/Register";
import Profile from "./pages/profile/Profile.jsx";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Community from "./pages/Community";
import AdminPanel from "./pages/AdminPanel.jsx";
import TopColaborators from "./pages/TopColaborators.jsx";
import { AuthContext } from "./contexts/AuthContext";
import ActivityDetailWrapper from "./wrappers/ActivityDetailWrapper";
import ActivityForm from "./pages/create-edit-forms/ActivityForm";
import ScheduleBuilder2 from "./pages/schedules/ScheduleBuilder2";
import { getActivities, getTypes } from "./services/api.js";

function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  const [activities, setActivities] = useState([]);
  const [typeNames, setTypeNames] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    // user: currentUser,
    profileData,
    // fetchProfile,
  } = useContext(AuthContext);

  useEffect(() => {
    fetchActivities().catch((err) => {
      console.error("Error cargando actividades:", err);
    });
    async function fetchTypes() {
      const types = await getTypes();
      setTypeNames(types);
    }
    fetchTypes();
    setLoading(false);
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
              <Home
                activities={activities}
                typeNames={typeNames}
                setActivities={setActivities}
                profileData={profileData}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/community" element={<Community />} />
          <Route
            path="/topColaborators"
            element={
              <PrivateRoute>
                <TopColaborators
                  activities={activities}
                  setActivities={setActivities}
                />
              </PrivateRoute>
            }
          />

          {/* Private pages */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile typeNames={typeNames}/>
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/:id"
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
            path="/activities/edit/:id"
            element={
              <PrivateRoute>
                <ActivityForm />
              </PrivateRoute>
            }
          />

          {/* Activity detail */}
          <Route path="/activities/:id" element={<ActivityDetailWrapper typeNames={typeNames}/>} />

          <Route
            path="/schedule/create"
            element={
              <PrivateRoute>
                <ScheduleBuilder2 />
              </PrivateRoute>
            }
          />

          <Route
            path="/schedule/:id"
            element={
              <PrivateRoute>
                <ScheduleBuilder2 />
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
