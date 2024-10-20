import { baseQuery } from "./config";

interface SearchGameQueryParams {
    user_id: string;
    timeout?: number;
    game_name?: string;
}

export const createUser = async () => {
    await fetch(
        "http://www.chesswebapp.xyz:5101/create_user?user_id=123&fullname=fullname&username=username",
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};

export const searchGame = async (queryParams: SearchGameQueryParams) => {
    const response = await baseQuery(
        `/search?user_id=${queryParams.user_id}`,
        undefined,
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    return response;
};
