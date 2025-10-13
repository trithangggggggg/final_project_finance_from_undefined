import { Routes, Route, Navigate } from "react-router-dom";
import UserRegisterPage from "../components/forms/UserRegisterPage";
import UserLoginPage from "../components/forms/UserLoginPage";
import PageHome from "../Pages/users/PageHome";
import InfomationUser from "../Pages/users/InfomationUser";
import AdminPage from "../Pages/admin/AdminPage";
import DashboardPage from "../Pages/admin/DashboardPage";
import UserPage from "../Pages/admin/UserManagerPage";
import CategoryPage from "../Pages/admin/CategoryPage";
import LoginPage from "../components/forms/LoginPage";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";
import ProtectedAdminRoute from "../components/protectedRoute/ProtectedAdminRoute";
import CategoryUser from "../Pages/users/CategoryUser";
import HistoryUser from "../Pages/users/HistoryUser";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ===== USER ROUTES ===== */}
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/register" element={<UserRegisterPage />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <PageHome />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="information" replace />} />
        <Route path="information" element={<InfomationUser />} />
        <Route path="category" element={<CategoryUser />} />
        <Route path="history" element={<HistoryUser />} />
      </Route>

      {/* ===== ADMIN ROUTES ===== */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminPage />
          </ProtectedAdminRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UserPage />} />
        <Route path="categories" element={<CategoryPage />} />
      </Route>
    </Routes>
  );
}
