import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import "./index.css";
import { RouterProvider } from "./app/providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
    <RouterProvider />
    // </React.StrictMode>
);
