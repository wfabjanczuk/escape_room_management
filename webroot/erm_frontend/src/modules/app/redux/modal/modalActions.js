import ModalActionTypes from './modalTypes';

export const showModal = (onConfirm) => ({
    type: ModalActionTypes.SHOW_MODAL,
    payload: onConfirm,
});

export const hideModal = () => ({
    type: ModalActionTypes.HIDE_MODAL,
    payload: null,
});

