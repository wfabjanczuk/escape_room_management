import AuthActionTypes from './authTypes';

const INITIAL_STATE = {
    currentUser: {
        profile: null,
        guestId: 0,
        jwt: null,
        apiHeaders: {
            'Content-Type': 'application/json',
        },
    }
};

const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case AuthActionTypes.SET_CURRENT_USER:
            return {
                currentUser: {
                    ...action.payload,
                    apiHeaders: {
                        ...state.apiHeaders,
                        'Authorization': 'Bearer ' + action.payload.jwt,
                    }
                },
            };
        case AuthActionTypes.LOG_OUT:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default authReducer;