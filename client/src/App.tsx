import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";   // tự động lấy index.tsx

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
