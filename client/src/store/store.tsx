import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slice/authSlice";
import userManagerReducer from "./slice/userManagerSlice";
import authAdminReducer from "./slice/authAdminSlice";
import financeSlice from "./slice/financeSlice";
import adminCategoryReducer from "./slice/adminCategory";
import transactionReducer from "./slice/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userManager: userManagerReducer,
    authAdmin: authAdminReducer,
    finance: financeSlice,
    adminCategory: adminCategoryReducer,
    transactions: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
