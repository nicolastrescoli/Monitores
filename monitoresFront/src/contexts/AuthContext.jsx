import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // SOLO datos del usuario
  const [profileData, setProfileData] = useState(null); // Perfil completo
  const [loading, setLoading] = useState(true);

  // --- LOGIN ---
  async function login(email, password) {
    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("authToken", token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Cargar perfil automáticamente tras login
      await fetchProfile();

      return res.data.user;
    } catch (error) {
      console.error(error.response?.data);
      throw new Error(error.response?.data?.message || "Error en login");
    }
  }

  // --- LOGOUT ---
  function logout() {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setProfileData(null);
  }

  // --- GET PROFILE ---
  async function fetchProfile() {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.get("http://localhost:8000/api/profile");

    setUser(res.data.user); // Solo el usuario
    setProfileData(res.data); // Todo el perfil
  }

  // --- LOAD USER ON PAGE REFRESH ---
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    fetchProfile().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profileData,
        loading,
        login,
        logout,
        fetchProfile,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { AuthContext, useAuth, AuthProvider };
