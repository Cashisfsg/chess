const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const baseQuery = async (
    endpoint: string,
    requestOptions?: RequestInit
) => {
    const response = await fetch(`${BASE_API_URL}${endpoint}`, requestOptions);

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
