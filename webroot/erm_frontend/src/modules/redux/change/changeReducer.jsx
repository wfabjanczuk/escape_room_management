const INITIAL_STATE = {
    counter: 0,
};

const increaseChangeCounterInState = (state) => ({
    ...state,
    counter: state.counter + 1,
});

const changeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'INCREASE_CHANGE_COUNTER':
            return increaseChangeCounterInState(state);
        default:
            return state;
    }
};

export default changeReducer;
