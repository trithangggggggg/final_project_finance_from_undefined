import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";   // tự động lấy index.tsx
import { Provider } from "react-redux";
import { store } from "./store/store";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
}
