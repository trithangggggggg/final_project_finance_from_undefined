import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import AddCategoryModal from "../../components/ui/AddCategoryModal";
import {
  fetchCategories,
  toggleCategoryStatus,
} from "../../store/slice/adminCategory";
import type { RootState } from "../../store/store";
import type { Category } from "../../utils/type";
import axios from "axios";

export default function CategoryPage() {
  const dispatch: any = useDispatch();
  const { categories, loading, totalPages } = useSelector(
    (state: RootState) => state.adminCategory
  );

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const limit = 6;

  // useEffect(()=>{
  //   setCurrentPage(1);
  // },[searchTerm])

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(
        fetchCategories({ page: currentPage, limit, search: searchTerm })
      );
    }, 400);
    return () => clearTimeout(delay);
  }, [dispatch, currentPage, searchTerm]);

  const handleToggleStatus = (category: Category) =>
    dispatch(toggleCategoryStatus(category));

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  
// const handleDelete = async (id: number) => {
//   if (confirm("Bạn có chắc muốn xóa danh mục này không?")) {
//     await axios.delete(`http://localhost:8080/categories/${id}`);
//     dispatch(fetchCategories({page: currentPage, limit, search: searchTerm}));
//   }
// };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex flex-col bg-gray-50 p-2 overflow-hidden h-[610px]">
      {/* ========================Header====================== */}
      <div className="mb-4 flex justify-between items-center flex-shrink-0">
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
        >
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

      {/* ======================================Table=============*/}
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
                  <th className="w-[220px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Name
                  </th>
                  <th className="w-[150px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Image
                  </th>
                  <th className="w-[120px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Status
                  </th>
                  <th className="w-[180px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-500 py-6 text-sm"
                    >
                      Không có dữ liệu danh mục.
                    </td>
                  </tr>
                ) : (
                  categories.map((category, index) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50 transition-all h-[64px] border-b border-gray-100"
                    >
                      <td className="px-4 text-sm text-gray-700">
                        {(currentPage - 1) * limit + index + 1}
                      </td>
                      <td className="px-4 text-sm font-medium text-gray-900 truncate">
                        {category.name}
                      </td>
                      <td className="px-4">
                        <div className="w-12 h-12 border border-gray-300 rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                (e.currentTarget.src =
                                  "https://via.placeholder.com/60x60?text=No+Image")
                              }
                            />
                          ) : (
                            <img
                              src="https://via.placeholder.com/60x60?text=No+Image"
                              alt="No Image"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-4 text-sm">
                        {category.status ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                            <span className="text-lg">•</span> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                            <span className="text-lg">•</span> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="rounded mt-5 bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-medium w-[70px] h-[28px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(category)}
                          className={`rounded mt-5 text-white text-xs font-medium w-[70px] h-[28px] ${
                            category.status
                              ? "bg-red-500 hover:bg-red-700"
                              : "bg-green-500 hover:bg-green-700"
                          }`}
                        >
                          {category.status ? "Block" : "Unblock"}
                        </button>
                        {/* <button
                          onClick={() => handleDelete(category.id)}
                          className=" bg-red-500 hover:bg-red-700"
                        >
                          Xóa
                        </button> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Phân trang giống */}
        <div className="p-4 flex justify-end mb-1">
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

      {showModal && (
        <AddCategoryModal
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          category={editingCategory}
        />
      )}
    </div>
  );
}
