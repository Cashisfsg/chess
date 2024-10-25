import { baseQuery } from "../../../shared/api/config";

import { type CreateUserRequest } from "./types";

export const createNewUser = (
    body: CreateUserRequest,
    requestOptions?: RequestInit
) => {
    return baseQuery("/user/create", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        },
        ...requestOptions
    });
};
