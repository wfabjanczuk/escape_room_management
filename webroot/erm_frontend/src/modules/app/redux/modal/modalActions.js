export const showModal = (onConfirmCallback) => ({
    type: 'SHOW_MODAL',
    payload: onConfirmCallback,
});

export const hideModal = () => ({
    type: 'HIDE_MODAL',
    payload: null,
});

