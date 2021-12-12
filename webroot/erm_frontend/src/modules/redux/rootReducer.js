import {combineReducers} from 'redux';
import flashReducer from './flash/flashReducer';
import changeReducer from "./change/changeReducer";

export default combineReducers({
    flash: flashReducer,
    change: changeReducer,
});
