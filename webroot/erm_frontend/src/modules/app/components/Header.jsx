import React from 'react';
import {Link} from 'react-router-dom';
import {logOutCurrentUser, setCurrentUser} from '../../redux/user/userActions';
import {connect} from 'react-redux';

const Header = ({currentUser, signIn, logOut}) => (<header>
    <div className='title-with-authentication'>
        <h1><Link className='hoverable' to='/'>Escape Room Management</Link></h1>
        {currentUser
            ? <div className='authentication authentication--wrap'>
                <p>Hello {currentUser.name}!</p>
                <button className='button button--primary-light' onClick={() => logOut()}>Log out</button>
            </div>
            : <div className='authentication'>
                <button className='button button--primary-light' onClick={() => signIn()}>Sign in</button>
                <button className='button button--primary-light'>Sign up</button>
            </div>
        }
    </div>
    <Link className='logo-link hoverable' to='/'>
        <img className='header-logo' src={'logo.png'} alt='Escape Room Management Logo'/>
    </Link>
</header>);

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
    signIn: () => dispatch(setCurrentUser({
        name: 'John',
        privileges: {
            guests: 1,
        }
    })),
    logOut: () => dispatch(logOutCurrentUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
