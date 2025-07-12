import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SnackbarProvider } from "notistack";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
    <App />
  </SnackbarProvider>
);