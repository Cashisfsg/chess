import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { WelcomePage } from "../../pages/welcome";
import { SettingsPage } from "../../pages/settings/page";
import { GamePage } from "../../pages/game";
import { RoomPage } from "../../pages/room/page";

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
        path: "game",
        element: <GamePage />
    },
    {
        path: "room/:roomId",
        element: <RoomPage />
    }
]);

export const Provider = () => {
    return <RouterProvider router={router} />;
};
