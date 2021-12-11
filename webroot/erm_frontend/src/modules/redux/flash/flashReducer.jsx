const INITIAL_STATE = {
    counter: 0,
    messages: [],
};

const addMessageToState = (state, type, content) => ({
    ...state,
    counter: state.counter + 1,
    messages: [
        ...state.messages,
        {
            id: state.counter + 1,
            type: type,
            content: content,
        }
    ],
});

const removeMessageFromState = (state, id) => ({
    ...state,
    messages: [
        ...state.messages.filter(m => id !== m.id),
    ],
})

const flashReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ADD_SUCCESS_MESSAGE':
            return addMessageToState(state, 'success', action.payload);
        case 'ADD_WARNING_MESSAGE':
            return addMessageToState(state, 'success', action.payload);
        case 'ADD_ERROR_MESSAGE':
            return addMessageToState(state, 'error', action.payload);
        case 'REMOVE_MESSAGE':
            return removeMessageFromState(state, action.payload);
        default:
            return state;
    }
};

export default flashReducer;
