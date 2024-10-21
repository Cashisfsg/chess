import { createNewUser } from "./create-user";
import { type CreateUserRequest } from "./types";

export const userApi = {
    create: async (queryParams: CreateUserRequest) =>
        await createNewUser(queryParams)
};
