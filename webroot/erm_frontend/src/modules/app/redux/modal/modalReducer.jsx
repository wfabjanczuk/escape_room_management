const INITIAL_STATE = {
    isVisible: false,
    onConfirmCallback: null,
};

const modalReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SHOW_MODAL':
            return {
                isVisible: true,
                onConfirmCallback: action.payload,
            };
        case 'HIDE_MODAL':
            return {
                isVisible: false,
                onConfirmCallback: null,
            };
        default:
            return state;
    }
};

export default modalReducer;
