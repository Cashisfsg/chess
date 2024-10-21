export type SearchParams = Record<string, string | number>;

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

    return await fetch(
        `${import.meta.env.VITE_BASE_API_URL}${endpoint}${queryParams ? `?${searchParams.toString()}` : ""}`,
        requestOptions
    );
};
