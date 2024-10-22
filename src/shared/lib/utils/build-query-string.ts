export const buildQueryString = (
    endpoint: string,
    queryParams?: Record<string, string | number>
) => {
    const searchParams = new URLSearchParams();

    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            searchParams.append(key, value.toString());
        });
    }

    return `${endpoint}${queryParams ? `?${searchParams.toString()}` : ""}`;
};
