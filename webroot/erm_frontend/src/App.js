import React, {useEffect} from 'react';
import {BrowserRouter} from 'react-router-dom';
import Footer from './modules/app/components/Footer';
import Header from './modules/app/components/Header';
import Navigation from './modules/app/components/Navigation';
import FlashMessenger from './modules/app/components/flash/FlashMessenger';
import AppRoutes from './modules/app/components/AppRoutes';
import {setCurrentUser} from './modules/app/redux/auth/authActions';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import Modal from './modules/app/components/Modal';

const App = ({currentUser, setCurrentUser}) => {
    const isLoggedIn = currentUser.profile !== null;

    useEffect(() => {
        const currentUserFromStorage = window.localStorage.getItem('currentUser');

        if (currentUserFromStorage) {
            setCurrentUser(JSON.parse(currentUserFromStorage));
        }
    }, [isLoggedIn]);

    return <BrowserRouter>
        <Header/>
        <Navigation/>
        <main>
            <FlashMessenger/>
            <AppRoutes/>
        </main>
        <Footer/>
        <Modal/>
    </BrowserRouter>;
}

App.propTypes = {
    currentUser: PropTypes.object,
    setCurrentUser: PropTypes.func,
}

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
    setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);