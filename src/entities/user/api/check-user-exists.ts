import { baseQuery } from "@/shared/api/config";

export const checkUserExists = (
    user_id: string,
    requestOptions?: RequestInit
) => {
    return baseQuery(`/user/exists/${user_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        ...requestOptions
    });
};
