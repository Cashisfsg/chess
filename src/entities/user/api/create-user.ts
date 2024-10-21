import { baseQuery } from "../../../shared/api/config";

import { type CreateUserRequest } from "./types";

export const createNewUser = async (body: CreateUserRequest) => {
    return baseQuery("/user/create", undefined, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    });
};
