export const setCurrentUser = (user) => ({
    type: 'SET_CURRENT_USER',
    payload: user
});

export const logOutCurrentUser = () => ({
    type: 'LOG_OUT_CURRENT_USER',
});