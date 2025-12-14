import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ children }) {
  const { loggedUser } = useSelector((state) => state.auth);
  if (!loggedUser) return <Navigate to="/login" replace />;
  if (loggedUser && !loggedUser.email_verified_at) return <Navigate to="/email-not-verified" />;
  return children;
}

export default PrivateRoute;
