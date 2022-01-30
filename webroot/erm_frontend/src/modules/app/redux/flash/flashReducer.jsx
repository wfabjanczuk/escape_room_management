import FlashActionTypes from './flashTypes';

const INITIAL_STATE = {
    nextId: 0,
    messages: [],
};

const addMessageToState = (state, type, content) => ({
    nextId: state.nextId + 1,
    messages: [
        ...state.messages,
        {
            id: state.nextId,
            type: type,
            content: content,
        }
    ],
});

const removeMessageFromState = (state, id) => ({
    nextId: state.nextId,
    messages: [
        ...state.messages.filter(m => id !== m.id),
    ],
})

const flashReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FlashActionTypes.ADD_SUCCESS_MESSAGE:
            return addMessageToState(state, 'success', action.payload);
        case FlashActionTypes.ADD_WARNING_MESSAGE:
            return addMessageToState(state, 'success', action.payload);
        case FlashActionTypes.ADD_ERROR_MESSAGE:
            return addMessageToState(state, 'error', action.payload);
        case FlashActionTypes.REMOVE_MESSAGE:
            return removeMessageFromState(state, action.payload);
        default:
            return state;
    }
};

export default flashReducer;
