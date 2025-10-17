import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import ModalLogout from "../../components/ui/ModalLogout";

export default function AdminPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Admin logged out");
    setShowLogoutConfirm(false);
    navigate("/admin/login")
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-44 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="px-4 h-16 border-b border-gray-200 flex items-center shadow-md">
          <h1 className="text-base font-semibold text-gray-800">
            Financial <span className="text-blue-600">Manager</span>
          </h1>
        </div>

        <nav className="p-1 flex-1 flex flex-col gap-1">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-sm  ${
                isActive ? "text-blue-600 bg-white border-b" : "text-gray-700 hover:bg-blue-100 border-b border-gray-200 "
              }`
            }
          >
            ▦ Dashboard
          </NavLink>

        <NavLink
            to="users"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-sm  ${
                isActive ? "text-blue-600 bg-white border-b" : "text-gray-700 hover:bg-blue-100 border-b border-gray-200"
              }`
            }
          >
            👥 Users
          </NavLink>

          <NavLink
            to="categories"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-sm  ${
                isActive ? "text-blue-600 bg-white border-b " : "text-gray-700 hover:bg-blue-100 border-b border-gray-200"
              }`
            }
          >
            ☷ Category
          </NavLink>
        </nav>

        {/* modal confirm signout */}
        <div className="p-4 mt-auto">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-44 relative">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-md fixed top-0 right-0 left-44 z-10">
          <div className="flex justify-end px-8 h-16 items-center relative">
            {/* Avatar */}
            <button
              type="button"
              onClick={() => setShowMenu((v) => !v)}
              className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-lg hover:ring-2 hover:ring-blue-500 transition"
            >
              👤
            </button>

            {/* Dropdown menu: Change Password + Logout */}
            {showMenu && (
              <div className="absolute top-14 right-8 w-44 bg-white rounded-lg shadow-lg border border-gray-100 m-2 p-2">
                <button
                  type="button"
                  className="w-full text-center px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 rounded"
                  // TODO: mở modal đổi mật khẩu
                >
                  Change Password
                </button>
                <button
                  type="button"
                  className="w-full text-center mt-1 px-4 py-2 text-sm text-white bg-red-700 hover:bg-red-600 rounded"
                  onClick={() => {
                    setShowLogoutConfirm(true); // dùng chung modal confirm
                    setShowMenu(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 mt-16">
          <Outlet />
        </div>
      </div>

      {/* Modal confirm logout (đặt dưới, dùng chung cho cả 2 nơi) */}
      {showLogoutConfirm && (
        <ModalLogout
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}
