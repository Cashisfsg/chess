interface QueryParams {
    user_id: string;
    fullname: string;
    username: string;
}

export const createNewUser = async (queryParams: QueryParams) => {
    const searchParams = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
        searchParams.append(key, value.toString());
    });

    await fetch(
        `http://www.chesswebapp.xyz:5101/create_user?${searchParams.toString()}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};
