import { createContext, useState } from "react";

// Creamos el contexto
export const AuthContext = createContext();

// Proveedor de contexto
export function AuthProvider({ children }) {
  // Estado del usuario: null = no logueado
  const [user, setUser] = useState(null);

  // Función de login simulada
  const login = (username, role = "user") => {
    setUser({ name: username, role }); // role puede ser "user" o "admin"
  };

  // Función de logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
