import {
    createBrowserRouter,
    RouterProvider,
    Navigate
} from "react-router-dom";
import { WelcomePage } from "@/pages/welcome";
import { SearchPage } from "@/pages/search";
import { GamePage } from "@/pages/game";
import { RoomPage } from "@/pages/room/page";
import { TestPage } from "@/pages/test-page";
import { CreateLobbyPage } from "@/pages/create-lobby";

const router = createBrowserRouter([
    {
        path: "/",
        element: <WelcomePage />
    },
    {
        path: "search",
        element: <SearchPage />
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
        path: "lobby",
        element: <CreateLobbyPage />
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
