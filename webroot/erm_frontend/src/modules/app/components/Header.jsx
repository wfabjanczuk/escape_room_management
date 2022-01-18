import React from 'react';
import {Link} from 'react-router-dom';
import {logOutCurrentUser} from '../../redux/user/userActions';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import ROUTES from '../constants/routes';

const Header = ({currentUser, logOut}) => (<header>
    <div className='title-with-authentication'>
        <h1><Link className='hoverable' to='/'>Escape Room Management</Link></h1>
        {currentUser
            ? <div className='authentication authentication--wrap'>
                <p>Hello {currentUser.name}!</p>
                <button className='button button--authentication' onClick={() => logOut()}>Log out</button>
            </div>
            : <div className='authentication'>
                <Link className='button button--authentication' to={ROUTES.authentication.signIn}>
                    Sign in
                </Link>
                <Link className='button button--authentication' to={ROUTES.authentication.signUp}>
                    Sign up
                </Link>
            </div>
        }
    </div>
    <Link className='logo-link hoverable' to='/'>
        <img className='header-logo' src={process.env.PUBLIC_URL + '/logo.png'} alt='Escape Room Management Logo'/>
    </Link>
</header>);

Header.propTypes = {
    currentUser: PropTypes.object,
    logOut: PropTypes.func,
};

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
    logOut: () => dispatch(logOutCurrentUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
