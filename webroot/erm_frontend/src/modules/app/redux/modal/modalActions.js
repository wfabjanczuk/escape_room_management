export const showModal = (onConfirm) => ({
    type: 'SHOW_MODAL',
    payload: onConfirm,
});

export const hideModal = () => ({
    type: 'HIDE_MODAL',
    payload: null,
});

