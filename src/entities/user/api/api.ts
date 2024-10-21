import { createNewUser } from "./create-user";
import { type CreateUserRequest } from "./types";

export const user = {
    create: async (
        queryParams: CreateUserRequest,
        requestOptions?: RequestInit
    ) => await createNewUser(queryParams, requestOptions)
};
