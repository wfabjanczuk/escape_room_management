import {combineReducers} from 'redux';
import flashReducer from './flash/flashReducer';
import changeReducer from './change/changeReducer';
import authReducer from './auth/authReducer';

export default combineReducers({
    auth: authReducer,
    flash: flashReducer,
    change: changeReducer,
});
