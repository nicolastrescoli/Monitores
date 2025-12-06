import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "./layouts/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/login-register/Login.jsx";
import Register from "./pages/login-register/Register.jsx";
import Profile from "./pages/profile/Profile.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Community from "./pages/Community.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import TopColaborators from "./pages/TopColaborators.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import ActivityDetail from "./pages/components/ActivityDetail.jsx";
import ActivityForm from "./pages/create-edit-forms/ActivityForm.jsx";
import ScheduleBuilder from "./pages/schedules/ScheduleBuilder.jsx";

import { useDispatch } from "react-redux";
// import { fetchLoggedUser } from "./redux/features/authSlice";
import { fetchActivities } from "./redux/features/activitySlice.js";
import { getTypes } from "./services/api.js";

export default function App() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.activities);
  const [types, setTypes] = useState([])

  useEffect(() => {
    // dispatch(fetchLoggedUser());
    dispatch(fetchActivities());
    const loadTypes = async () => {
      const res = await getTypes();
      setTypes(res);
    };

    loadTypes()
  }, [dispatch]);

  if (loading || !types)
    return <div className="container py-5">Cargando actividades...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public pages */}
          <Route path="/" element={<Home types={types}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
          <Route path="/community" element={<Community />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />

          {/* Private pages */}
          <Route
            path="/topColaborators"
            element={
              <PrivateRoute>
                <TopColaborators />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
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

          <Route
            path="/schedule/create"
            element={
              <PrivateRoute>
                <ScheduleBuilder />
              </PrivateRoute>
            }
          />

          <Route
            path="/schedule/:id"
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
