export const addSuccessMessage = (content) => ({
    type: 'ADD_SUCCESS_MESSAGE',
    payload: content,
});

export const addWarningMessage = (content) => ({
    type: 'ADD_WARNING_MESSAGE',
    payload: content,
});

export const addErrorMessage = (content) => ({
    type: 'ADD_ERROR_MESSAGE',
    payload: content,
});

export const removeMessage = (id) => ({
    type: 'REMOVE_MESSAGE',
    payload: id,
});
