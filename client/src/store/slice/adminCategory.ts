import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Category, CategoryState } from "../../utils/type";

const initialState: CategoryState = {
  categories: [],
  totalPages: 1,
  loading: false,
  error: null,
};

// Thêm danh mục mới
export const addCategory = createAsyncThunk<
  Category,
  { name: string; image: string }
>("adminCategory/addCategory", async (payload) => {
  const res = await axios.post<Category>("http://localhost:8080/categories", {
    ...payload,
    status: true,
  });
  return res.data;
});

// 🟦 Lấy danh sách category (phân trang + tìm kiếm)
export const fetchCategories = createAsyncThunk<
  { categories: Category[]; totalPages: number },
  { page: number; limit: number; search?: string }
>("adminCategory/fetchCategories", async ({ page, limit, search }) => {
  const searchQuery = search ? `&q=${encodeURIComponent(search)}` : "";
  const res = await axios.get<Category[]>(
    `http://localhost:8080/categories?_page=${page}&_limit=${limit}${searchQuery}`
  );
  const totalCount = parseInt(res.headers["x-total-count"] || "0", 10);
  return {
    categories: res.data,
    totalPages: Math.max(1, Math.ceil(totalCount / limit)),
  };
});

// Đổi trạng thái hoạt động / khóa
export const toggleCategoryStatus = createAsyncThunk<
  { id: number; status: boolean | null },
  Category
>("adminCategory/toggleCategoryStatus", async (category) => {
  const newStatus = !category.status;
  await axios.patch(`http://localhost:8080/categories/${category.id}`, {
    status: newStatus,
  });
  return { id: category.id, status: newStatus };
});

// Cập nhật danh mục
export const updateCategory = createAsyncThunk<
  Category,
  { id: number; name: string; image: string }
>("adminCategory/updateCategory", async ({ id, name, image }) => {
  const res = await axios.patch<Category>(
    `http://localhost:8080/categories/${id}`,
    { name, image }
  );
  return res.data;
});

const adminCategorySlice = createSlice({
  name: "adminCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
        state.error = "Không thể tải danh sách danh mục!";
      })

      // Add category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updated = action.payload;
        state.categories = state.categories.map((c) =>
          c.id === updated.id ? updated : c
        );
      })

      // Toggle status
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.categories = state.categories.map((c) =>
          c.id === id ? { ...c, status } : c
        );
      })
      .addCase(toggleCategoryStatus.rejected, (state) => {
        state.error = "Không thể cập nhật trạng thái danh mục!";
      });
  },
});

export default adminCategorySlice.reducer;
