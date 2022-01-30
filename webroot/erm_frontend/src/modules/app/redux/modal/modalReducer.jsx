import ModalActionTypes from './modalTypes';

const INITIAL_STATE = {
    isVisible: false,
    onConfirm: null,
};

const modalReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ModalActionTypes.SHOW_MODAL:
            return {
                isVisible: true,
                onConfirm: action.payload,
            };
        case ModalActionTypes.HIDE_MODAL:
            return {
                isVisible: false,
                onConfirm: null,
            };
        default:
            return state;
    }
};

export default modalReducer;
