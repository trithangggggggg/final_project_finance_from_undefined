import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slice/authSlice";
import userManagerReducer from "./slice/userManagerSlice";
import authAdminReducer from "./slice/authAdminSlice";
import financeSlice from "./slice/financeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userManager: userManagerReducer,
    authAdmin: authAdminReducer,
    finance: financeSlice,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;