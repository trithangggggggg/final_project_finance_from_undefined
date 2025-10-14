import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Lock, Unlock } from "lucide-react";
import {
  fetchUsers,
  toggleUserStatus,
} from "../../store/slice/userManagerSlice";
import type { User } from "../../utils/type";
import type { RootState } from "../../store/store";

export default function UserManagerPage() {
  const dispatch: any = useDispatch();
  const { users, loading, totalPages } = useSelector(
    (state: RootState) => state.userManager
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  // 🟦 Lấy danh sách user
  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchUsers({ page: currentPage, limit, search: searchTerm }));
    }, 400);
    return () => clearTimeout(delay);
  }, [dispatch, currentPage, searchTerm]);

  // 🟩 Đổi trạng thái user
  const handleToggleStatus = (user: User) => {
    dispatch(toggleUserStatus(user));
  };

  // const filteredUsers = users.filter(
  //   (user) =>
  //     (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // 🧭 Chuyển trang
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const renderGender = (gender: boolean | string | null | undefined): string => {
  if (gender === true || gender === "Male") return "Male";
  if (gender === false || gender === "Female") return "Female";
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

  return (
    <div className="flex flex-col bg-gray-50 p-2 overflow-hidden h-[610px]">
      {/* 🔍 Thanh tìm kiếm */}
      <div className="mb-4 flex justify-end flex-shrink-0">
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

      {/* 🧾 Bảng danh sách */}
      <div className="bg-white rounded-lg shadow-sm flex flex-col flex-1 overflow-auto max-h-[540px]">
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              Đang tải...
            </div>
          ) : (
            <table className="w-full table-fixed">
              <thead className="bg-gray-100 sticky top-0">
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
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-gray-500 py-6 text-sm"
                    >
                      Không có dữ liệu người dùng.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-all h-[64px] border-b border-gray-100"
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
                      <td className="px-4 text-sm">
                        {renderStatus(user.status)}
                      </td>
                      <td className="px-4">
                        {user.status ? (
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className="p-1.5 rounded-full hover:bg-green-100 text-green-600 flex items-center gap-1"
                          >
                            <Unlock size={16} />
                            <span className="text-xs font-medium">Active</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className="p-1.5 rounded-full hover:bg-red-100 text-red-600 flex items-center gap-1"
                          >
                            <Lock size={16} />
                            <span className="text-xs font-medium ">
                              Deactivate
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* 🔢 Phân trang */}
        <div className="  p-4 flex justify-end mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 border rounded transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

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
    </div>
  );
}
