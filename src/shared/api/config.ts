export type SearchParams = Record<string, string | number>;

export const baseQuery = async (
    endpoint: string,
    queryParams?: SearchParams,
    requestOptions?: RequestInit
) => {
    // const baseApiUrl = new URL("/api/v1");

    // console.log(baseApiUrl);

    // const url = new URL(endpoint, "");

    // console.log(url);

    const searchParams = new URLSearchParams();

    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            searchParams.append(key, value.toString());
        });
    }

    console.log(searchParams.toString());

    return await fetch(
        `https://chesswebapp.xyz/api/v1${endpoint}`,
        requestOptions
    );
};
