import React, { useEffect, useState } from "react";
import { ChevronDown, Info, History, Shapes } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchMonthlyCategory,
  updateMonthlyBudget,
  fetchTransactions,
  setSelectedMonth,
} from "../../store/slice/financeSlice";
import CategoryUser from "./CategoryUser";

export default function PageHome() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    currentMonthData,
    remaining,
    warningMessage,
    loading,
    selectedMonth,
  } = useSelector((state: RootState) => state.finance);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [monthInput, setMonthInput] = useState(
    selectedMonth || new Date().toISOString().slice(0, 7)
  );

  // 🟢 Khi user chọn tháng → fetch dữ liệu tháng
  useEffect(() => {
    if (monthInput) {
      dispatch(setSelectedMonth(monthInput));
      dispatch(fetchMonthlyCategory(monthInput)).then((res: any) => {
        if (res.payload?.id) {
          dispatch(fetchTransactions(res.payload.id));
        }
      });
    }
  }, [monthInput, dispatch]);

  // 🟢 Khi cập nhật ngân sách tháng
  const handleSaveBudget = () => {
    if (!currentMonthData) return;
    const totalBudget = Number(budgetInput);
    if (isNaN(totalBudget) || totalBudget <= 0) {
      alert("Vui lòng nhập ngân sách hợp lệ!");
      return;
    }
    dispatch(updateMonthlyBudget({ id: currentMonthData.id, totalBudget }))
      .unwrap()
      .then(() => {
        dispatch(fetchTransactions(currentMonthData.id));
        setBudgetInput("");
      });
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const sidebarItems = [
    { name: "Information", icon: <Info size={16} />, path: "/home/information" },
    { name: "Category", icon: <Shapes size={16} />, path: "/home/category" },
    { name: "History", icon: <History size={16} />, path: "/home/history" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f9] text-gray-700">
      {/* ===== HEADER ===== */}
      <header className="bg-[#4f46e5] text-white p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-md">
        <h1 className="font-semibold text-sm sm:text-base pl-4 md:pl-28">
          📒 Tài Chính Cá Nhân K24_Rikkei
        </h1>

        <div className="relative pr-4 md:pr-29">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="text-sm">Tài khoản</span>
            <ChevronDown size={18} />
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-40 bg-white text-gray-800 rounded shadow-md border border-gray-100 z-50">
              <div className="px-4 py-2 border-b text-sm">user@example.com</div>
              <button
                onClick={() => {
                  setShowModal(true);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ===== SIDEBAR ===== */}
      <aside className="fixed top-[80px] left-4 md:left-8 z-40 flex flex-col gap-3">
        {sidebarItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center justify-start gap-2 w-[130px] px-3 py-2 rounded-md text-sm transition-all border shadow-md ${
              location.pathname === item.path
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="pt-[80px] pb-5 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Banner */}
          <div className="bg-[#4F46E5] rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">🎯</span>
              <h1 className="text-2xl md:text-3xl font-semibold">
                Kiểm soát chi tiêu thông minh
              </h1>
            </div>
            <p className="text-center text-indigo-100 text-sm md:text-base">
              Theo dõi ngân sách và thu chi hàng tháng dễ dàng
            </p>
          </div>

          {/* Title */}
          <div className="flex items-center justify-center gap-3 py-4">
            <span className="text-3xl">📊</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-indigo-700">
              Quản Lý Tài Chính Cá Nhân
            </h2>
          </div>

          {/* Balance */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 text-center">
            <p className="text-gray-600 mb-2 text-sm md:text-base">
              Số tiền còn lại
            </p>
            <p className="text-4xl text-green-500">
              {loading ? "..." : `${remaining.toLocaleString()} VND`}
            </p>
          </div>

          {/* Month Selection */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-xl">📅</span>
                <span className="font-medium">Chọn tháng:</span>
              </div>
              <input
                type="month"
                value={monthInput}
                onChange={(e) => setMonthInput(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Budget Input */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-xl">💰</span>
                <span className="font-medium">Ngân sách tháng:</span>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="VD: 5000000"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
                />
                <button
                  onClick={handleSaveBudget}
                  disabled={loading}
                  className="px-6 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-300"
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </div>

          {/* Warning Card */}
          {warningMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 shadow-sm text-center">
              {warningMessage}
            </div>
          )}

          {/* ===== USER INFORMATION SECTION ===== */}
          {/* <Outlet /> */}
          <CategoryUser/>
        </div>
      </main>

      {/* Modal Logout */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xác nhận đăng xuất</h3>
            <p className="text-gray-600 mb-6">Bạn có chắc muốn đăng xuất?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
