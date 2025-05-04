import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AdminAuthProvider } from "./components/AdminControls/AdminAuthContext";
import { AdminThemeProvider } from "./components/AdminControls/AdminThemeProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AdminAuthProvider>
      <AdminThemeProvider>
        <App />
      </AdminThemeProvider>
    </AdminAuthProvider>
  </React.StrictMode>
);
