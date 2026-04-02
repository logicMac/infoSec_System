export const getAuthData = () => {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    
    return { token, user: parsedUser };
};
    