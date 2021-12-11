import {combineReducers} from 'redux';
import flashReducer from './flash/flashReducer';

export default combineReducers({
    flash: flashReducer,
});
