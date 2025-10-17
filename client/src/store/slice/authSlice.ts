import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AuthState } from "../../utils/type";

const initialState: AuthState = {
  user: null,
  loading: false,
  successMessage: "",
  errorMessage: "",
};

//  Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData: { email: string; password: string; confirmPassword: string }) => {
    try {
      const response = await axios.post("http://localhost:8080/users", {
        password: formData.password,
        fullName: "",
        email: formData.email,
        phone: "",
        gender: null,
        status: true,
      });
      return response.data;
    } catch (error) {
      console.log("Register error:", error);
    }
  }
);

//  Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { username: string; password: string; errorMessage: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get("http://localhost:8080/users", {
        params: {
          email: credentials.username,
          password: credentials.password,
          // status: credentials.status
        },
      });

      if (res.data.length === 0) {
        return rejectWithValue("Email or password is incorrect"); 
      }

      const currentUser = res.data[0];
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: currentUser.id || "",
          email: currentUser.email || "",
          password: currentUser.password || "",
          fullName: currentUser.fullName || "",
          phone: currentUser.phone || "",
          gender: currentUser.gender ?? null,
          status: currentUser.status ?? null,
        })
      );
      return currentUser;
    } catch (error) {
      return rejectWithValue("Server error, please try again later!");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("currentUser");
    },
    clearMessages: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.successMessage = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.successMessage = "Sign Up Successfully!";
        }
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.successMessage = "";
        state.errorMessage = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.successMessage = "Sign In Successfully!";
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload as string; 
      });
  },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;
