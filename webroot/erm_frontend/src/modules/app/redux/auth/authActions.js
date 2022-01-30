import AuthActionTypes from './authTypes';

export const setCurrentUser = (user) => ({
    type: AuthActionTypes.SET_CURRENT_USER,
    payload: user
});

export const logOut = () => ({
    type: AuthActionTypes.LOG_OUT,
});