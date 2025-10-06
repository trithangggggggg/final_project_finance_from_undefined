import React, { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plane,
  Building2,
  Utensils,
  Users,
  Baby,
  Hotel,
  Settings,
  Coffee,
} from "lucide-react";

export default function CategoryTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const categories = [
    { id: 1, name: "Tiện ích bay", icon: Plane, status: true },
    { id: 2, name: "Tiện xăng", icon: Building2, status: false },
    { id: 3, name: "Tiện ăn", icon: Utensils, status: true },
    { id: 4, name: "Tiện đi chơi", icon: Users, status: false },
    { id: 5, name: "Tiện cho con", icon: Baby, status: true },
    { id: 6, name: "Tiện dự phòng", icon: Hotel, status: true },
    { id: 7, name: "Tiện sửa đồ", icon: Settings, status: true },
    { id: 8, name: "Tiện cà phê", icon: Coffee, status: true },
  ];

  const totalPages = 2;
  const currentPage = 1;

  return (
    <div className="flex flex-col bg-gray-50 p-2 overflow-hidden h-[610px]">
      {/* 🔍 Thanh tìm kiếm + nút thêm */}
      <div className="mb-4 flex justify-between items-center flex-shrink-0">
        <button className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium">
           Add Category
        </button>

        <div className="w-full max-w-xs relative">
          <input
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* 🧾 Bảng danh mục */}
      <div className="bg-white rounded-lg shadow-sm flex flex-col flex-1 overflow-auto max-h-[540px]">
        <div className="overflow-y-auto flex-1">
          <table className="w-full table-fixed">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="w-[60px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                  STT
                </th>
                <th className="w-[220px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Name
                </th>
                <th className="w-[150px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Icon
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
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50 transition-all h-[64px] border-b border-gray-100"
                  >
                    <td className="px-4 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 text-sm font-medium text-gray-900 truncate">
                      {category.name}
                    </td>
                    <td className="px-4 text-sm text-gray-700">
                      <div className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center">
                        <IconComponent size={20} className="text-gray-700" />
                      </div>
                    </td>
                    <td className="px-4 text-sm">
                      {category.status ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                          <span className="text-lg">•</span> Active
                        </span>
                      ) : (
                        <button className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                          <span className="text-lg">•</span> Inactive
                        </button>
                      )}
                    </td>
                    <td className="px-4">
                      {category.status ? (
                        <button className=" rounded bg-red-500 hover:bg-red-700 text-white flex items-center gap-1 text-xs font-medium w-[60px] h-[25px] p-2.5">
                          Block
                        </button>
                      ) : (
                        <button className=" rounded bg-green-500 hover:bg-green-700 text-white flex items-center  text-xs font-medium w-[60px] h-[25px] p-2">
                          Unblock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 🔢 Phân trang */}
        <div className="p-4 flex justify-end mb-1">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              ←
            </button>

            {[1, 2].map((page) => (
              <button
                key={page}
                className={`px-3 py-1.5 border rounded transition text-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
