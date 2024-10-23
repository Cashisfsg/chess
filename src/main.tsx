import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import "./index.css";
import { RouterProvider } from "@/app/providers/router";
import { WebSocketProvider } from "@/app/providers/web-socket";

ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
    <WebSocketProvider>
        <RouterProvider />
    </WebSocketProvider>
    // </React.StrictMode>
);
