export interface SearchParams extends Record<string, string | number> {}

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const baseQuery = async (
    endpoint: string,
    queryParams?: SearchParams,
    requestOptions?: RequestInit
) => {
    const searchParams = new URLSearchParams();

    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            searchParams.append(key, value.toString());
        });
    }

    const response = await fetch(
        `${BASE_API_URL}${endpoint}${queryParams ? `?${searchParams.toString()}` : ""}`,
        requestOptions
    );

    if (!response.ok) {
        const error = new Error(
            "An error occurred while fetching the data."
        ) as Error & { detail?: any; status?: number };

        error.detail = await response.json();
        error.status = response.status;
        throw error;
    }

    return response.json();
};
