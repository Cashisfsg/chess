// import { baseQuery } from "./config";

interface SearchGameQueryParams {
    user_id: string;
    timeout?: number;
    game_name?: string;
}

export const searchGame = async (queryParams: SearchGameQueryParams) => {
    const response = await fetch(
        `https://chesswebapp.xyz/api/v1/search?user_id=${queryParams.user_id}`
        // undefined,
        // {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // }
    );

    return response;
};
