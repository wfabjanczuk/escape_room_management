import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import './modal.css';
import App from './App';
import {Provider} from 'react-redux';
import store from './modules/app/redux/store';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
