import React from "react";
import { Outlet } from "react-router-dom";

import AuthProvider from "../../hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
