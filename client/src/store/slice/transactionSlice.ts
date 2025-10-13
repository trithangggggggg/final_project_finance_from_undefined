import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

/**
 * Fetch user monthly categories and map to full category names
 */
export const fetchTransactionMonthlyCategories = createAsyncThunk(
  "transactions/fetchTransactionMonthlyCategories",
  async (userId: number) => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);

      const { data: allMonthly } = await axios.get(`${BASE_URL}/monthlycategories`);
      const userMonthly = allMonthly.find(
        (m: any) => Number(m.userId) === Number(userId) && m.month === currentMonth
      );

      if (!userMonthly) {
        return [];
      }

      const { data: allCategories } = await axios.get(`${BASE_URL}/categories`);

      const mapped = userMonthly.categories.map((c: any) => {
        const info = allCategories.find((cat: any) => Number(cat.id) === Number(c.categoryId));
        return {
          id: c.categoryId,
          name: info?.name,
          budget: c.budget,
        };
      });
      return mapped;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
);

/**
 * Fetch all categories
 */
export const fetchCategories = createAsyncThunk("transactions/fetchCategories", async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/categories`);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
});

/**
 * Add new transaction
 */
export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transactionData: any) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/transactions`, transactionData);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
);

/**
 * Delete transaction
 */
export const deleteTransaction = createAsyncThunk("transactions/deleteTransaction", async (id: number) => {
  try {
    await axios.delete(`${BASE_URL}/transactions/${id}`);
    return id;
  } catch (error) {
    console.error(error);
    return null;
  }
});

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [] as any[],
    categories: [] as any[],
    loading: false,
  },
  reducers: {
    // Dùng nếu bạn muốn chủ động reset store khi đổi tháng từ nơi khác
    resetTransactionState: (state) => {
      state.transactions = [];
      state.categories = [];
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Monthly categories
      .addCase(fetchTransactionMonthlyCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionMonthlyCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchTransactionMonthlyCategories.rejected, (state) => {
        state.loading = false;
      })

      // Add transaction
      .addCase(addTransaction.fulfilled, (state, action) => {
        if (action.payload) {
          state.transactions.unshift(action.payload);
        }
      })

      // Delete transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        if (action.payload) {
          state.transactions = state.transactions.filter((t) => t.id !== action.payload);
        }
      });
  },
});

export const { resetTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;
