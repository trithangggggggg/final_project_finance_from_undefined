import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"
import axios from "axios";
import type { FinanceState, IMonthlyCategory, ITransaction } from "../../utils/type";

const BASE_URL = "http://localhost:8080";


const initialState: FinanceState = {
  monthlycategories: [],
  transactions: [],
  selectedMonth: "",
  currentMonthData: null,
  remaining: 0,
  warningMessage: "",
  loading: false,
  error: null,
};

// 🟢 1. Lấy hoặc tạo tháng chi tiêu
export const fetchMonthlyCategory = createAsyncThunk<
  IMonthlyCategory,
  string,
  { rejectValue: string }
>("finance/fetchMonthlyCategory", async (month, { rejectWithValue }) => {
  try {
    const res = await axios.get<IMonthlyCategory[]>(
      `${BASE_URL}/monthlycategories?month=${month}`
    );

    if (res.data.length > 0) {
      return res.data[0];
    }

    // Nếu tháng chưa tồn tại → tạo mới
    const newMonth = {
      month,
      totalBudget: 0,
      categories: [],
    };
    const createRes = await axios.post<IMonthlyCategory>(
      `${BASE_URL}/monthlycategories`,
      newMonth
    );
    return createRes.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// 🟢 2. Cập nhật ngân sách tháng
export const updateMonthlyBudget = createAsyncThunk<
  IMonthlyCategory,
  { id: number; totalBudget: number },
  { rejectValue: string }
>("finance/updateMonthlyBudget", async ({ id, totalBudget }, { rejectWithValue }) => {
  try {
    const res = await axios.patch<IMonthlyCategory>(
      `${BASE_URL}/monthlycategories/${id}`,
      { totalBudget }
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// 🟢 3. Lấy danh sách giao dịch theo tháng
export const fetchTransactions = createAsyncThunk<
  ITransaction[],
  number,
  { rejectValue: string }
>("finance/fetchTransactions", async (monthlycategoryId, { rejectWithValue }) => {
  try {
    const res = await axios.get<ITransaction[]>(
      `${BASE_URL}/transactions?monthlycategoryId=${monthlycategoryId}`
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    setSelectedMonth(state, action: PayloadAction<string>) {
      state.selectedMonth = action.payload;
    },
    clearWarning(state) {
      state.warningMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH MONTHLY CATEGORY ---
      .addCase(fetchMonthlyCategory.pending, (state) => {
        state.loading = true;
        state.warningMessage = "";
      })
      .addCase(fetchMonthlyCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMonthData = action.payload;
        state.warningMessage = action.payload.totalBudget
          ? ""
          : "⚠️ Chưa nhập ngân sách cho tháng này.";
      })
      .addCase(fetchMonthlyCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi tải dữ liệu tháng.";
      })

      // --- UPDATE MONTHLY BUDGET ---
      .addCase(updateMonthlyBudget.fulfilled, (state, action) => {
        state.currentMonthData = action.payload;
        state.warningMessage = "";
      })

      // --- FETCH TRANSACTIONS ---
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        const totalSpent = action.payload.reduce(
          (sum, t) => sum + t.total,
          0
        );
        const budget = state.currentMonthData?.totalBudget || 0;
        state.remaining = budget - totalSpent;

        if (budget === 0) {
          state.warningMessage = "⚠️ Chưa nhập ngân sách cho tháng này.";
        } else if (state.remaining < 0) {
          state.warningMessage = "🚨 Bạn đã vượt quá ngân sách!";
        } else {
          state.warningMessage = "";
        }
      });
  },
});

export const { setSelectedMonth, clearWarning } = financeSlice.actions;
export default financeSlice.reducer;
