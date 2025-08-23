import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/header/Navbar";
import AddStore from "./components/pages/AddStore";
import AddUser from "./components/pages/AddUser";
import AdminDashboard from "./components/pages/AdminDashboard";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Logout from "./components/pages/Logout";
import Register from "./components/pages/Register";
import SearchStores from "./components/pages/SearchStores";
import SearchUsers from "./components/pages/SearchUsers";
import UpdatePassword from "./components/pages/UpdatePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute roles={"*"}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/logout"
            element={
              <ProtectedRoute roles={"*"}>
                <Logout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-password"
            element={
              <ProtectedRoute roles={"*"}>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-user"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AddUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-store"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AddStore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <SearchUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-stores"
            element={
              <ProtectedRoute roles={["admin", "user"]}>
                <SearchStores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
