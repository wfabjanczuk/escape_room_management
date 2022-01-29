import {combineReducers} from 'redux';
import flashReducer from './flash/flashReducer';
import changeReducer from './change/changeReducer';
import authReducer from './auth/authReducer';
import modalReducer from './modal/modalReducer';

export default combineReducers({
    auth: authReducer,
    flash: flashReducer,
    change: changeReducer,
    modal: modalReducer,
});
