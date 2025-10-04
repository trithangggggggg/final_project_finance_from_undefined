import { Routes, Route } from "react-router-dom";
import UserRegisterPage from "../components/forms/UserRegisterPage";
import UserLoginPage from "../components/forms/UserLoginPage";
import PageHome from "../Pages/users/PageHome";
import AdminPage from "../Pages/admin/AdminPage";
import DashboardPage from "../Pages/admin/DashboardPage";
import UserPage from "../Pages/admin/UserManagerPage";
import CategoryPage from "../Pages/admin/CategoryPage";
import LoginPage from "../components/forms/LoginPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* USER ROUTES */}
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/register" element={<UserRegisterPage />} />
      <Route path="/home" element={<PageHome />} />

      {/* ADMIN ROUTES */}  
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UserPage />} />
        <Route path="categories" element={<CategoryPage />} />
      </Route>
    </Routes>
  );
}
