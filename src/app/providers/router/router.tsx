import {
    createBrowserRouter,
    RouterProvider,
    Navigate
} from "react-router-dom";
import { WelcomePage } from "@/pages/welcome";
import { SettingsPage } from "@/pages/settings/page";
import { GamePage } from "@/pages/game";
import { RoomPage } from "@/pages/room/page";
import { TestPage } from "@/pages/test-page";

const router = createBrowserRouter([
    {
        path: "/",
        element: <WelcomePage />
    },
    {
        path: "settings",
        element: <SettingsPage />
    },
    {
        path: "game/:roomId",
        element: <GamePage />
    },
    {
        path: "room/:roomId",
        element: <RoomPage />
    },
    {
        path: "test",
        element: <TestPage />
    },
    {
        path: "*",
        element: <Navigate to="/" />
    }
]);

export const Provider = () => {
    return <RouterProvider router={router} />;
};
