import ChangeActionTypes from './changeTypes';

export const increaseChangeCounter = () => ({
    type: ChangeActionTypes.INCREASE_CHANGE_COUNTER,
    payload: null,
});
