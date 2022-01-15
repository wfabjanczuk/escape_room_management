import {combineReducers} from 'redux';
import flashReducer from './flash/flashReducer';
import changeReducer from './change/changeReducer';
import userReducer from './user/userReducer';

export default combineReducers({
    user: userReducer,
    flash: flashReducer,
    change: changeReducer,
});
