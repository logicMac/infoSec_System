export const getAuthData = () => {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    const id = parsedUser?.user_id;

    return { token, user: parsedUser, id };
};


    