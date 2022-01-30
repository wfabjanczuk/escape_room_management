import FlashActionTypes from './flashTypes';

export const addSuccessMessage = (content) => ({
    type: FlashActionTypes.ADD_SUCCESS_MESSAGE,
    payload: content,
});

export const addWarningMessage = (content) => ({
    type: FlashActionTypes.ADD_WARNING_MESSAGE,
    payload: content,
});

export const addErrorMessage = (content) => ({
    type: FlashActionTypes.ADD_ERROR_MESSAGE,
    payload: content,
});

export const removeMessage = (id) => ({
    type: FlashActionTypes.REMOVE_MESSAGE,
    payload: id,
});
