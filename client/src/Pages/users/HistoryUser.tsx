import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import axios from "axios";
import { fetchTransactions } from "../../store/slice/financeSlice";
import type { AppDispatch, RootState } from "../../store/store";

const BASE_URL = "http://localhost:8080";

export default function HistoryUser() {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading } = useSelector((state: RootState) => state.finance);
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentMonthData } = useSelector((state: RootState) => state.finance);

  // Form input
  const [total, setTotal] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sort / filter / pagination
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Admin categories for mapping names
  const [adminCategories, setAdminCategories] = useState<any[]>([]);
  // Cờ tránh “nháy” dữ liệu cũ khi đổi tháng
  const [switchingMonth, setSwitchingMonth] = useState(false);

  useEffect(() => {
    const fetchAdminCategories = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/categories`);
        const active = (data || []).filter((c: any) => c.status);
        setAdminCategories(active);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAdminCategories();
  }, []);

  // Khi đổi tháng: reset UI cục bộ + fetch giao dịch của tháng mới
  useEffect(() => {
    const loadMonth = async () => {
      if (!currentMonthData?.id) return;
      // Reset local UI state để không dính tháng cũ
      setTotal("");
      setCategoryId("");
      setDescription("");
      setErrors({});
      setCurrentPage(1);
      setSwitchingMonth(true);
      try {
        await dispatch(fetchTransactions(currentMonthData.id));
      } finally {
        setSwitchingMonth(false);
      }
    };
    loadMonth();
  }, [dispatch, currentMonthData?.id]);

  // Validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!total) newErrors.total = "Vui lòng nhập số tiền";
    else if (isNaN(Number(total)) || Number(total) <= 0) newErrors.total = "Số tiền không hợp lệ";
    if (!categoryId) newErrors.categoryId = "Vui lòng chọn danh mục";
    if (!description) newErrors.description = "Vui lòng nhập ghi chú";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add
  const handleAdd = async () => {
    if (!validate()) return;

    const userId = user?.id || currentMonthData?.userId;
    if (!userId || !currentMonthData?.id) {
      alert("Không tìm thấy userId hoặc monthlyCategoryId — vui lòng đăng nhập lại!");
      return;
    }

    const newTransaction = {
      createdDate: new Date().toISOString().split("T")[0],
      total: Number(total),
      description,
      categoryId: Number(categoryId),
      monthlyCategoryId: currentMonthData.id,
      userId,
    };

    try {
      const { data } = await axios.post(`${BASE_URL}/transactions`, newTransaction);
      // Sau khi thêm thành công, fetch lại dữ liệu tháng hiện tại
      await dispatch(fetchTransactions(currentMonthData.id));
      // Reset form
      setTotal("");
      setCategoryId("");
      setDescription("");
      setErrors({});
      // Optional: bạn có thể log data nếu muốn kiểm tra phản hồi
      // console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!currentMonthData?.id) return;
    if (!window.confirm("Bạn có chắc muốn xóa giao dịch này?")) return;

    try {
      await axios.delete(`${BASE_URL}/transactions/${id}`);
      await dispatch(fetchTransactions(currentMonthData.id));
    } catch (error) {
      console.error(error);
    }
  };

  // Filter + sort
  const filtered = useMemo(() => {
    // QUAN TRỌNG: chỉ lấy giao dịch của đúng tháng hiện tại
    const monthId = currentMonthData?.id;
    let list = [...transactions]
      .filter((t: any) => t.monthlyCategoryId === monthId)
      .filter((t: any) =>
        (t.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortOrder === "asc") {
      list.sort((a: any, b: any) => a.total - b.total);
    } else if (sortOrder === "desc") {
      list.sort((a: any, b: any) => b.total - a.total);
    } else {
      list.sort(
        (a: any, b: any) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
    }

    return list;
  }, [transactions, sortOrder, searchTerm, currentMonthData?.id]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const currentData = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-4">
      {/* Form add transaction */}
      <div className="bg-white rounded-2xl pt-8 pb-8 flex shadow-lg border border-gray-100 justify-around">
        <div className="flex flex-col">
          <input
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="border-gray-200 border rounded-lg pl-2 w-[180px] h-[42px]"
            type="number"
            placeholder="Số tiền"
          />
          {errors.total && <span className="text-red-500 text-xs mt-1">{errors.total}</span>}
        </div>

        <div className="flex flex-col">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border-gray-200 border rounded-lg w-[180px] h-[42px]"
          >
            <option value="">Chọn danh mục</option>
            {currentMonthData?.categories && currentMonthData.categories.length > 0 ? (
              currentMonthData.categories.map((c: any) => {
                const categoryInfo = adminCategories.find((adminCat) => adminCat.id === c.categoryId);
                return (
                  <option key={c.categoryId} value={c.categoryId}>
                    {categoryInfo?.name || `Danh mục ${c.categoryId}`} ({c.budget.toLocaleString()} VND)
                  </option>
                );
              })
            ) : (
              <option disabled>Không có danh mục tháng</option>
            )}
          </select>
          {errors.categoryId && <span className="text-red-500 text-xs mt-1">{errors.categoryId}</span>}
        </div>

        <div className="flex flex-col">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-gray-200 border rounded-lg pl-2 w-[180px] h-[42px]"
            type="text"
            placeholder="Ghi chú"
          />
          {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description}</span>}
        </div>

        <button
          onClick={handleAdd}
          className="border-gray-200 border bg-[#3B82F6] hover:bg-blue-600 text-white w-[90px] h-[42px] rounded-lg"
        >
          Thêm
        </button>
      </div>

      {/* History table */}
      <div className="bg-white rounded-2xl mt-6 shadow-lg border border-gray-100 p-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <span className="font-medium text-gray-700 text-lg">🧾 Lịch sử giao dịch (theo tháng)</span>

          <div className="flex gap-2 items-center">
            <select
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc" | "none")}
              className="border border-gray-300 rounded-lg text-sm px-2 py-1 h-[36px]"
            >
              <option value="none">Sắp xếp theo giá</option>
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
            <div className="relative">
              <input
                type="text"
                className="border border-gray-300 rounded-lg pl-3 pr-8 py-1 text-sm h-[36px]"
                placeholder="Tìm theo nội dung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left w-[60px]">STT</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left w-[140px]">Budget</th>
                <th className="px-4 py-3 text-left">Note</th>
                <th className="px-4 py-3 text-left w-[120px]">Date</th>
                <th className="px-4 py-3 text-center w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading || switchingMonth ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">Đang tải...</td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-6">Không có dữ liệu.</td>
                </tr>
              ) : (
                currentData.map((row: any, index: number) => {
                  const categoryInfo = adminCategories.find((c: any) => c.id === row.categoryId);
                  return (
                    <tr key={row.id} className="border-t hover:bg-gray-50 transition-all">
                      <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{categoryInfo?.name || "Không rõ"}</td>
                      <td className="px-4 py-3 text-gray-700">{row.total.toLocaleString()} ₫</td>
                      <td className="px-4 py-3 text-gray-600">{row.description}</td>
                      <td className="px-4 py-3 text-gray-600">{row.createdDate}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="text-red-500 hover:text-red-700 text-lg leading-none"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-1.5 border rounded ${
                currentPage === p
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-100 border-gray-300"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
