import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { WelcomePage } from "../../pages/welcome";
import { SettingsPage } from "../../pages/settings/page";
import { GamePage } from "../../pages/game";

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
    }
]);

export const Provider = () => {
    return <RouterProvider router={router} />;
};
