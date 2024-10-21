// import { baseQuery } from "./config";

interface SearchGameQueryParams {
    user_id: string;
    timeout?: number;
    game_name?: string;
}

export const searchGame = async (
    queryParams: SearchGameQueryParams,
    requestOptions?: RequestInit
) => {
    return await fetch(
        `https://www.chesswebapp.xyz/api/v1/search?user_id=${queryParams.user_id}`,
        requestOptions
    );
};
