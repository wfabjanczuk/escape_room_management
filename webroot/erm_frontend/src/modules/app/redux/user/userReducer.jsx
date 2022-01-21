const INITIAL_STATE = {
    currentUser: null,
    authorizationHeader: '',
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload.user,
                authorizationHeader: 'Bearer ' + action.payload.jwt,
            };
        case 'LOG_OUT_CURRENT_USER':
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default userReducer;