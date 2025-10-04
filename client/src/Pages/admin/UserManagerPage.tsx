import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Lock, Unlock } from "lucide-react";
import type { User } from "../../utils/type";

export default function UserManagerPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // 👉 mỗi trang 6 user

  // 🟦 Gọi dữ liệu theo trang
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(
        `http://localhost:8080/users?_page=${currentPage}&_limit=${limit}`
      );
      const totalCount = parseInt(res.headers["x-total-count"] || "0", 10);
      setUsers(res.data);
      setTotalPages(Math.ceil(totalCount / limit));
    } catch (error) {
      console.error("Error khi tải dữ liệu:", error);
      alert("Không thể tải danh sách người dùng!");
    }
  };

  // 🟩 Toggle Lock / Unlock
  const handleToggleStatus = async (user: User) => {
    const newStatus = !user.status;
    try {
      await axios.patch(`http://localhost:8080/users/${user.id}`, {
        status: newStatus,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    } catch (error) {
      console.error("Error khi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái người dùng!");
    }
  };

  // 🔍 Lọc user
  const filteredUsers = users.filter(
    (user) =>
      (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderGender = (gender: boolean | null) => {
    if (gender === true) return "Male";
    if (gender === false) return "Female";
    return "—";
  };

  const renderStatus = (status: boolean | null) => {
    if (status === true)
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
          <span className="text-lg">•</span> Hoạt động
        </span>
      );
    if (status === false)
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
          <span className="text-lg">•</span> Bị khóa
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
        <span className="text-lg">•</span> —
      </span>
    );
  };

  // 🧭 Chuyển trang
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col bg-gray-50 p-6">
      {/* 🔍 Ô tìm kiếm căn phải */}
      <div className="mb-6 flex justify-end">
        <div className="w-full max-w-xs relative">
          <input
            type="text"
            placeholder="Search here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* 🧾 Bảng dữ liệu */}
      <div className="bg-white rounded-lg shadow-sm">
        <table className="w-full table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-[60px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                STT
              </th>
              <th className="w-[200px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                Name
              </th>
              <th className="w-[240px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                Email
              </th>
              <th className="w-[140px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                Phone
              </th>
              <th className="w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                Gender
              </th>
              <th className="w-[120px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                Status
              </th>
              <th className="w-[120px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-gray-500 py-6 text-sm"
                >
                  Không có dữ liệu người dùng.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-all h-[64px]"
                >
                  <td className="px-4 text-sm text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="px-4 text-sm font-medium text-gray-900 truncate">
                    {user.fullName || "—"}
                  </td>
                  <td className="px-4 text-sm text-gray-700 truncate">
                    {user.email}
                  </td>
                  <td className="px-4 text-sm text-gray-700">
                    {user.phone || "—"}
                  </td>
                  <td className="px-4 text-sm text-gray-700">
                    {renderGender(user.gender)}
                  </td>
                  <td className="px-4 text-sm">{renderStatus(user.status)}</td>
                  <td className="px-4">
                    {user.status ? (
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="p-1.5 rounded hover:bg-green-50 text-green-600 flex items-center gap-1"
                        title="Mở khóa tài khoản"
                      >
                        <Unlock size={16} />
                        <span className="text-xs font-medium">Mở khóa</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600 flex items-center gap-1"
                        title="Khóa tài khoản"
                      >
                        <Lock size={16} />
                        <span className="text-xs font-medium">Khóa</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔢 Phân trang - Tách riêng, luôn cố định */}
      <div className=" flex justify-end  fixed bottom-15 right-15">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ←
          </button>
          <span className="px-3 py-1.5 bg-blue-600 text-white rounded">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}