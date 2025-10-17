import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchMonthlyCategory } from "../../store/slice/financeSlice";

const BASE_URL = "http://localhost:8080";

export default function CategoryUser() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentMonthData, selectedMonth } = useSelector(
    (state: RootState) => state.finance
  );

  const [adminCategories, setAdminCategories] = useState<any[]>([]);
  const [userCategories, setUserCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Load danh mục admin & user mỗi khi đổi tháng
  useEffect(() => {
    if (currentMonthData?.categories) {
      setUserCategories(currentMonthData.categories);
    }
    axios
      .get(`${BASE_URL}/categories`)
      .then((res) => {
        const activeCategories = res.data.filter((c: any) => c.status);
        setAdminCategories(activeCategories);
      })
      .catch(() => setAdminCategories([]));
  }, [currentMonthData]);

  // Xử lý thêm danh mục mới cho tháng
  const handleAddCategory = async () => {
    if (!selectedCategoryId || !limitAmount) {
      setErrorMessage("Vui lòng chọn danh mục và nhập số tiền!");
      return;
    }
    if (!currentMonthData) return;

    const budgetValue = Number(limitAmount);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      setErrorMessage("Số tiền không hợp lệ!");
      return;
    }

    // Kiểm tra trùng danh mục
    const alreadyExist = userCategories.some(
      (c) => c.categoryId === Number(selectedCategoryId)
    );
    if (alreadyExist) {
      setErrorMessage("Danh mục này đã tồn tại trong tháng!");
      return;
    }

    // Kiểm tra tổng ngân sách tháng
    const totalUsed = userCategories.reduce(
      (sum, c) => sum + (c.budget || 0),
      0
    );
    const totalBudget = currentMonthData.totalBudget || 0;
    if (totalUsed + budgetValue > totalBudget && totalBudget > 0) {
      setErrorMessage("Vượt quá ngân sách tháng!");
      return;
    }

    const newCategory = {
      categoryId: Number(selectedCategoryId),
      budget: budgetValue,
    };

    const updatedCategories = [...userCategories, newCategory];

    try {
      setSaving(true);
      await axios.patch(
        `${BASE_URL}/monthlycategories/${currentMonthData.id}`,
        {
          categories: updatedCategories,
        }
      );
      setLimitAmount("");
      setSelectedCategoryId("");
      setErrorMessage("");
      dispatch(fetchMonthlyCategory(selectedMonth));
    } catch (err) {
      console.error(" Lỗi khi thêm danh mục:", err);
    } finally {
      setSaving(false);
    }
  };

  // Xử lý xóa danh mục khỏi tháng hiện tại
const handleDeleteCategory = async (categoryId: number) => {
  if (!currentMonthData) return;

  // Hỏi lại người dùng để tránh xóa nhầm
  const confirmDelete = window.confirm("Bạn có chắc muốn xóa danh mục này?");
  if (!confirmDelete) return;

  // Lọc bỏ danh mục bị xóa
  const updatedCategories = userCategories.filter(
    (c) => c.categoryId !== categoryId
  );

  try {
    setSaving(true);
    await axios.patch(
      `${BASE_URL}/monthlycategories/${currentMonthData.id}`,
      { categories: updatedCategories }
    );
    // Cập nhật lại redux
    dispatch(fetchMonthlyCategory(selectedMonth));
  } catch (error) {
    console.error(" Lỗi khi xóa danh mục:", error);
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
      {/* Tiêu đề */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">💼</span>
        <h2 className="text-lg font-semibold text-gray-800">
          Quản lý danh mục (Theo tháng)
        </h2>
      </div>

      {/* Bộ chọn danh mục & thêm */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={selectedCategoryId}
          onChange={(e) => {
            setSelectedCategoryId(e.target.value);
            setErrorMessage("");
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
        >
          <option value="">Tên danh mục</option>
          {adminCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={limitAmount}
          onChange={(e) => {
            setLimitAmount(e.target.value);
            setErrorMessage("");
          }}
          placeholder="Giới hạn (VND)"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
        />

        <button
          onClick={handleAddCategory}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all"
        >
          Thêm danh mục
        </button>
      </div>

      {/* Cảnh báo */}
      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}

      {/* Lưới danh mục */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {userCategories.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">
            Chưa có danh mục nào được thêm cho tháng này.
          </p>
        ) : (
          userCategories.map((cate) => {
            const cateInfo = adminCategories.find(
              (a) => a.id === cate.categoryId
            );
            return (
              <div
                key={cate.categoryId}
                className="relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                onClick={() => {
                  const cateInfo = adminCategories.find(
                    (a) => a.id === cate.categoryId
                  );
                  setEditingCategory({
                    ...cate,
                    name: cateInfo?.name || "Danh mục",
                    image: cateInfo?.image || "",
                  });
                  setShowModal(true);
                }}
              >
                {/* Nút x danh mucc*/}
                <span className="absolute top-1 right-1 z-10 text-gray-400 hover:text-red-500 cursor-pointer text-lg leading-none"
                  onClick={(e)=>{
                    e.stopPropagation(),
                    handleDeleteCategory(cate.categoryId)
                  }}
                >
                  ×
                </span>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {cateInfo?.image ? (
                      <img
                        src={cateInfo.image}
                        alt={cateInfo.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl">$</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm truncate">
                      {cateInfo?.name || "Danh mục"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {cate.budget.toLocaleString()} VND
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {saving && (
        <p className="text-sm text-indigo-600 mt-4 text-center">
          💾 Đang lưu thay đổi...
        </p>
      )}
      {/* Modal chỉnh sửa danh mục */}
      {showModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            {/* Nút đóng */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            {/* Ảnh danh mục */}
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mx-auto mb-4">
              {editingCategory.image ? (
                <img
                  src={editingCategory.image}
                  alt={editingCategory.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">$</span>
              )}
            </div>

            {/* Tên danh mục */}
            <h2 className="text-center font-semibold text-gray-800 text-lg mb-3">
              {editingCategory.name}
            </h2>

            {/* Input số tiền */}
            <div className="flex flex-col items-center gap-2 mb-5">
              <label className="text-sm text-gray-600">
                Giới hạn chi tiêu (VND)
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 w-40 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={editingCategory.budget}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    budget: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* Nút hành động */}
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                onClick={async () => {
                  if (!editingCategory || !currentMonthData) return;

                  const value = Number(editingCategory.budget);
                  if (isNaN(value) || value <= 0) {
                    alert("Vui lòng nhập số tiền hợp lệ!");
                    return;
                  }

                  const totalUsed = userCategories.reduce(
                    (sum, c) =>
                      c.categoryId === editingCategory.categoryId ? sum  : sum + (c.budget || 0),
                    0
                  );

                  const totalBudget = currentMonthData.totalBudget || 0;
                  if (totalUsed + value > totalBudget && totalBudget > 0) {
                    alert("Vượt quá ngân sách tháng!");
                    return;
                  }

                  const updatedCategories = userCategories.map((c) =>
                    c.categoryId === editingCategory.categoryId ? { ...c, budget: value }: c
                  );

                  try {
                    setSaving(true);
                    await axios.patch(
                      `${BASE_URL}/monthlycategories/${currentMonthData.id}`,
                      { categories: updatedCategories }
                    );
                    dispatch(fetchMonthlyCategory(selectedMonth));
                    setShowModal(false);
                  } catch (error) {
                    console.error(" Lỗi khi cập nhật danh mục:", error);
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
