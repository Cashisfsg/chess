import { baseQuery } from "@/shared/api/config";

export const activateUser = async (id: number) => {
    return await baseQuery("/user/active", {
        headers: {
            "Content-Type": "application/json"
        },
        method: "PATCH",
        body: JSON.stringify({ user_id: id, active: true })
    });
};
