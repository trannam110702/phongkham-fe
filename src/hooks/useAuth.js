import { createContext, useContext, useMemo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useLocalStorage from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useLocalStorage("username");

  const navigate = useNavigate();
  const login = async ({ username }) => {
    setUsername(username);
    navigate("/");
  };

  const logout = () => {
    window.localStorage.removeItem("username");
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>{children}</AuthContext.Provider>
  );
};
export { AuthContext };
export default AuthProvider;
