interface User {
    user_id: string;
    fullname: string;
    username: string;
}

export interface CreateUserRequest extends User {}
