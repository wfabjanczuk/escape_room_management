const INITIAL_STATE = {
    currentUser: null,
    guestId: 0,
    apiHeaders: {
        'Content-Type': 'application/json',
    },
};

const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload.user,
                guestId: action.payload.guestId,
                apiHeaders: {
                    ...state.apiHeaders,
                    'Authorization': 'Bearer ' + action.payload.jwt,
                },
            };
        case 'LOG_OUT_CURRENT_USER':
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default authReducer;