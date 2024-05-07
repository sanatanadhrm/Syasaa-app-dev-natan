import React from "react";
import { createRoot } from "react-dom/client";
import { AuthContextProvider } from "./context/Auth";
import App from "./App";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "material-dashboard/assets/css/nucleo-icons.css";
import "material-dashboard/assets/css/nucleo-svg.css";
import "./public/assets/css/style.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "material-dashboard/assets/js/core/popper.min.js";
import "material-dashboard/assets/js/core/bootstrap.min.js";
import "material-dashboard/assets/js/plugins/smooth-scrollbar.min.js";
import "material-dashboard/assets/js/material-dashboard.min.js";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
