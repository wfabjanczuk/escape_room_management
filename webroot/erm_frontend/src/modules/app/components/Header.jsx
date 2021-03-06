import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {logOut} from '../redux/auth/authActions';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import ROUTES from '../constants/routes';

const Header = ({currentUser, logOut}) => {
    const navigate = useNavigate(),
        {pathname} = useLocation(),
        isActive = {
            profileDetails: pathname.startsWith(ROUTES.users.profileDetails),
            signIn: pathname.startsWith(ROUTES.users.signIn),
            signUp: pathname.startsWith(ROUTES.users.signUp),
        },
        onLogOutClick = () => {
            logOut();
            window.localStorage.removeItem('currentUser');
            navigate(ROUTES.users.signIn);
        };

    return <header className={`header ${currentUser.profile ? 'header--authenticated' : ''}`}>
        <div className='title-with-authentication'>
            <h1><Link className='hoverable' to='/'>Escape Room Management</Link></h1>
            {currentUser.profile
                ? <div className='authentication authentication--wrap'>
                    <p>Hello {currentUser.profile.firstName}!</p>
                    <div className='authentication'>
                        <Link
                            className={`button button--authentication hoverable ${isActive.profileDetails ? 'active' : ''}`}
                            to={ROUTES.users.profileDetails}
                        >
                            Profile
                        </Link>
                        <button className='button button--authentication hoverable' onClick={onLogOutClick}>
                            Log out
                        </button>
                    </div>
                </div>
                : <div className='authentication'>
                    <Link className={`button button--authentication hoverable ${isActive.signIn ? 'active' : ''}`}
                          to={ROUTES.users.signIn}>
                        Sign in
                    </Link>
                    <Link className={`button button--authentication hoverable ${isActive.signUp ? 'active' : ''}`}
                          to={ROUTES.users.signUp}>
                        Sign up
                    </Link>
                </div>
            }
        </div>
        <Link className='logo-link hoverable' to='/'>
            <img className='header-logo'
                 src={process.env.PUBLIC_URL + '/logo.png'}
                 alt='Escape Room Management Logo'
            />
        </Link>
    </header>;
}

Header.propTypes = {
    currentUser: PropTypes.object,
    logOut: PropTypes.func,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
    logOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
