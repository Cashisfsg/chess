import { baseQuery } from "../../../shared/api/config";

interface SearchGameQueryParams {
    user_id: string;
    timeout?: number;
    game_name?: string;
}

const endpoint = "/search";

export const searchGame = (params: SearchGameQueryParams) => {
    return baseQuery(endpoint, params);
};

export const searchGameCacheKey = (queryParams: SearchGameQueryParams) => {
    const searchParams = new URLSearchParams();

    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            searchParams.append(key, value.toString());
        });
    }

    return `${endpoint}?${searchParams.toString()}`;
};
