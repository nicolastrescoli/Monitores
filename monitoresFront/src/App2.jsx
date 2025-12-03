import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "./layouts/Layout.jsx";
import Home2 from "./pages/Home2.jsx";
import Login2 from "./pages/login-register/Login2.jsx";
import Register2 from "./pages/login-register/Register2.jsx";
import Profile2 from "./pages/profile/Profile2.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Community2 from "./pages/Community2.jsx";
import AdminPanel2 from "./pages/AdminPanel2.jsx";
import TopColaborators2 from "./pages/TopColaborators2.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import ActivityDetail from "./pages/components/ActivityDetail.jsx";
import ActivityForm2 from "./pages/create-edit-forms/ActivityForm2.jsx";
import ScheduleBuilder2 from "./pages/schedules/ScheduleBuilder2.jsx";

import { useDispatch } from "react-redux";
import { fetchLoggedUser } from "./redux/features/authSlice";
import { fetchActivities } from "./redux/features/activitySlice";

export default function App2() {

  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.activities);

  useEffect(() => {
    dispatch(fetchLoggedUser());
    dispatch(fetchActivities());
  }, [dispatch])

  if (loading) return <div className="container py-5">Cargando actividades...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>

          {/* Public pages */}
          <Route path="/" element={<Home2 />} />
          <Route path="/login" element={<Login2 />} />
          <Route path="/register" element={<Register2 />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
          <Route path="/community" element={<Community2 />} />

          {/* Private pages */}

          <Route path="/topColaborators" element={
              <PrivateRoute>
                <TopColaborators2 />
              </PrivateRoute>
            }
          />

          <Route path="/profile" element={
              <PrivateRoute>
                <Profile2 />
              </PrivateRoute>
            }
          />

          <Route path="/profile/:id" element={
              <PrivateRoute>
                <Profile2 />
              </PrivateRoute>
            }
          />

          <Route path="/activities/pending" element={
              <PrivateRoute roles={["admin"]}>
                <AdminPanel2 />
              </PrivateRoute>
            }
          />

          <Route path="/activities/create" element={
              <PrivateRoute>
                <ActivityForm2 />
              </PrivateRoute>
            }
          />

          <Route path="/activities/edit/:id" element={
              <PrivateRoute>
                <ActivityForm2 />
              </PrivateRoute>
            }
          />

          <Route path="/activities/:id" element={
            <ActivityDetail />}
          />

          <Route path="/schedule/create" element={
              <PrivateRoute>
                <ScheduleBuilder2 />
              </PrivateRoute>
            }
          />

          <Route path="/schedule/:id" element={
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
