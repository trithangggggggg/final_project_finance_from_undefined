// client/store/slice/authAdminSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AuthState } from "../../utils/type";

const initialState: AuthState = {
  user: null,
  loading: false,
  successMessage: "",
  errorMessage:""
};

//  Đăng nhập Admin
export const loginAdmin = createAsyncThunk(
  "authAdmin/loginAdmin",
  async (credentials: { username: string; password: string }) => {
    try {
      const res = await axios.get("http://localhost:8080/admin", {
        params: {
          email: credentials.username,
          password: credentials.password,
        },
      });

      if (res.data.length === 0) {
        console.log("Invalid admin credentials");
        return null;
      }

      const currentAdmin = res.data[0];

      localStorage.setItem(
        "currentAdmin",
        JSON.stringify({
          id: currentAdmin.id || "",
          email: currentAdmin.email || "",
          fullName: currentAdmin.fullName || "",
          role: currentAdmin.role || "admin",
        })
      );

      return currentAdmin;
    } catch (error) {
      console.log("Admin login error:", error);
      return null;
    }
  }
);

const authAdminSlice = createSlice({
  name: "authAdmin",
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.user = null;
      localStorage.removeItem("currentAdmin");
    },
    clearAdminMessages: (state) => {
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.successMessage = "";
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.successMessage = "Admin login successfully!";
        }
      })
      .addCase(loginAdmin.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logoutAdmin, clearAdminMessages } = authAdminSlice.actions;
export default authAdminSlice.reducer;
