import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type {
  FinanceState,
  IMonthlyCategory,
  ITransaction,
} from "../../utils/type";

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
  flag: false,
};

// 1) Lấy hoặc tạo dữ liệu chi tiêu của user theo tháng
export const fetchMonthlyCategory = createAsyncThunk<IMonthlyCategory, string>(
  "finance/fetchMonthlyCategory",
  async (month) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const userId = currentUser?.id;

      if (!userId) {
        console.error("Không tìm thấy userId hợp lệ");
        return { id: 0, userId: 0, month, totalBudget: 0, categories: [] } as IMonthlyCategory;
      }

      const res = await axios.get<IMonthlyCategory[]>(
        `${BASE_URL}/monthlycategories?userId=${userId}&month=${month}`
      );

      if (res.data.length > 0) {
        return res.data[0];
      }

      const newMonthData = { userId, month, totalBudget: 0, categories: [] };
      const createRes = await axios.post<IMonthlyCategory>(
        `${BASE_URL}/monthlycategories`,
        newMonthData
      );
      return createRes.data;
    } catch (error) {
      console.error(error);
      return { id: 0, userId: 0, month, totalBudget: 0, categories: [] } as IMonthlyCategory;
    }
  }
);

// 2) Cập nhật ngân sách tháng (PATCH)
export const updateMonthlyBudget = createAsyncThunk<
  IMonthlyCategory,
  { id: number; totalBudget: number }
>("finance/updateMonthlyBudget", async ({ id, totalBudget }) => {
  try {
    const updateResponse = await axios.patch<IMonthlyCategory>(
      `${BASE_URL}/monthlycategories/${id}`,
      { totalBudget }
    );
    return updateResponse.data;
  } catch (error) {
    console.error(error);
    return { id: 0, userId: 0, month: "", totalBudget: 0, categories: [] } as IMonthlyCategory;
  }
});

// 3) Lấy danh sách giao dịch của THÁNG hiện tại
export const fetchTransactions = createAsyncThunk<ITransaction[], number>(
  "finance/fetchTransactions",
  async (monthlyCategoryId) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const userId = currentUser?.id;
      if (!userId) {
        console.error("Không tìm thấy userId hợp lệ");
        return [];
      }

      // ⚠️ Sửa tham số: đúng là monthlyCategoryId (C viết hoa)
      // Lọc ngay trên server theo cả userId + monthlyCategoryId để chắc chắn chỉ trả về đúng tháng
      const { data } = await axios.get<ITransaction[]>(
        `${BASE_URL}/transactions?userId=${userId}&monthlyCategoryId=${monthlyCategoryId}`
      );

      return data || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

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
    updateLocalRemaining(state, action: PayloadAction<number>) {
      state.remaining = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH MONTHLY CATEGORY ---
      .addCase(fetchMonthlyCategory.pending, (state) => {
        state.loading = true;
        state.flag = true;
        state.warningMessage = "";
        // Khi đổi tháng: dọn dữ liệu cũ để tránh "nháy" số dư
        state.transactions = [];
        state.remaining = 0;
      })
      .addCase(fetchMonthlyCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.flag = false;
        state.currentMonthData = action.payload;

        const totalBudget = action.payload?.totalBudget || 0;

        // Đặt remaining tạm theo ngân sách tháng mới (trước khi transactions về)
        state.remaining = totalBudget;

        if (!totalBudget) {
          state.warningMessage = "⚠️ Bạn chưa nhập ngân sách cho tháng này.";
        } else {
          state.warningMessage = "";
        }
      })
      .addCase(fetchMonthlyCategory.rejected, (state) => {
        state.loading = false;
        state.flag = false;
        state.error = "Không thể tải dữ liệu chi tiêu tháng.";
      })

      // --- UPDATE MONTHLY BUDGET ---
      .addCase(updateMonthlyBudget.fulfilled, (state, action) => {
        state.currentMonthData = action.payload;

        const totalSpent = Array.isArray(state.transactions)
          ? state.transactions.reduce((sum, t) => sum + (t.total || 0), 0)
          : 0;

        const totalBudget = action.payload?.totalBudget || 0;
        state.remaining = totalBudget - totalSpent;

        if (totalBudget === 0) {
          state.warningMessage = "⚠️ Bạn chưa nhập ngân sách cho tháng này.";
        } else if (state.remaining < 0) {
          state.warningMessage = "🚨 Bạn đã vượt quá ngân sách!";
        } else {
          state.warningMessage = "";
        }
      })

      // --- FETCH TRANSACTIONS ---
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        // Clear để không giữ giao dịch tháng cũ trong lúc chờ
        state.transactions = [];
        // Nếu đã biết budget tháng hiện tại, giữ remaining = budget (tránh nhảy âm)
        const budget = state.currentMonthData?.totalBudget || 0;
        state.remaining = budget;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        // GHI ĐÈ dữ liệu tháng hiện tại
        state.transactions = action.payload;

        const totalSpent = action.payload.reduce(
          (sum, transaction) => sum + (transaction.total || 0),
          0
        );

        const totalBudget = state.currentMonthData?.totalBudget || 0;
        state.remaining = totalBudget - totalSpent;

        if (totalBudget === 0) {
          state.warningMessage = "⚠️ Bạn chưa nhập ngân sách cho tháng này.";
        } else if (state.remaining < 0) {
          state.warningMessage = "🚨 Bạn đã vượt quá ngân sách!";
        } else {
          state.warningMessage = "";
        }
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSelectedMonth, clearWarning, updateLocalRemaining } =
  financeSlice.actions;

export default financeSlice.reducer;
