import React, { useState } from "react";
// import ModalLogout from "../components/ui/ModalLogout";
import { ChevronDown } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import ModalLogout from "../../components/ui/ModalLogout";

export default function PageHome() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    setShowModal(false);
    localStorage.removeItem("currentUser");
    setTimeout(() => navigate("/login"), 1000);
  };

  return (
    <div>
      <header className="bg-indigo-600 text-white p-4 flex items-center justify-around relative">
        {/* Logo / title */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">📒 Tài Chính Cá Nhân K24_Rikkei</span>
        </div>

        {/* Account */}
        <div className="relative">
          <div className="flex items-center gap-2 ">
            <span className="text-sm">Tài khoản</span>
            <button
              onClick={toggleDropdown}
              className="text-sm bg-indigo-600 px-2 py-1 rounded  cursor-pointer"
            >
              <ChevronDown />
            </button>
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-1 w-auto bg-white text-gray-800 rounded shadow-lg ">
            
              <div className="px-4 py-2 border-b">
                User: {currentUser.email || "Unknown"}
              </div>
              <button
                onClick={() => {
                  setShowModal(true);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>


      {showModal && (
        <ModalLogout
          onClose={() => setShowModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}
