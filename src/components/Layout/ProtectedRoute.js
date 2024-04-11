import { useContext } from "react";
import { AuthContext } from "../../hooks/useAuth";
import Login from "../../pages/Login";
import Layout from "./Layout";

const ProtectedRoute = ({ children }) => {
  const { username } = useContext(AuthContext);

  if (!username) {
    return <Login />;
  }
  return <Layout>{children}</Layout>;
};
export default ProtectedRoute;
