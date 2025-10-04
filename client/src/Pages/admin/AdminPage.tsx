import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-44 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="px-4 h-16 border-b border-gray-200 flex items-center shadow-md">
          <h1 className="text-base font-semibold text-gray-800">
            Financial <span className="text-blue-600">Manager</span>
          </h1>
        </div>

        <nav className="p-2 flex-1 flex flex-col gap-1">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-sm rounded ${
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            ▦ Dashboard
          </NavLink>

          <NavLink
            to="users"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-sm rounded ${
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            👥 Users
          </NavLink>

          <NavLink
            to="categories"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-sm rounded ${
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            ☷ Category
          </NavLink>
        </nav>

        <div className="p-4 mt-auto">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-44">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-md fixed top-0 right-0 left-44 z-10">
          <div className="flex justify-end px-8 h-16 items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              👤
            </div>
          </div>
        </div>

        <div className="p-8 mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
