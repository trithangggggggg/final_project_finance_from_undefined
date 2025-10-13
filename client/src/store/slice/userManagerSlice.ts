import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { User, UserManagerState } from "../../utils/type";

const initialState: UserManagerState = {
  users: [],
  totalPages: 1,
  loading: false,
  error: null,
};

// 🟦 Lấy danh sách người dùng (có phân trang)
export const fetchUsers = createAsyncThunk<
  { users: User[]; totalPages: number },
  { page: number; limit: number; search?: string }
>("userManager/fetchUsers", async ({ page, limit, search }) => {
  const searchQuery = search ? `&q=${encodeURIComponent(search)}` : ""; 
  const res = await axios.get<User[]>(
    `http://localhost:8080/users?_page=${page}&_limit=${limit}${searchQuery}`
  );
  const totalCount = parseInt(res.headers["x-total-count"] || "0", 10);
  return {
    users: res.data,
    totalPages: Math.max(1, Math.ceil(totalCount / limit)),
  };
});

// 🟩 Đổi trạng thái hoạt động / khóa
export const toggleUserStatus = createAsyncThunk<
  { id: number; status: boolean | null },
  User
>("userManager/toggleUserStatus", async (user) => {
  const newStatus = !user.status;
  await axios.patch(`http://localhost:8080/users/${user.id}`, {
    status: newStatus,
  });
  return { id: user.id, status: newStatus };
});

const userManagerSlice = createSlice({
  name: "userManager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH USERS
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.users = action.payload.users;
          state.totalPages = action.payload.totalPages;
        }
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
        state.error = "Không thể tải danh sách người dùng!";
      });

    // TOGGLE STATUS
    builder
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.users = state.users.map((u) =>
            u.id === action.payload.id
              ? { ...u, status: action.payload.status }
              : u
          );
        }
      })
      .addCase(toggleUserStatus.rejected, (state) => {
        state.error = "Không thể cập nhật trạng thái người dùng!";
      });
  },
});

export default userManagerSlice.reducer;
