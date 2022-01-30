import React from 'react';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import ROUTES from '../constants/routes';
import {Link} from 'react-router-dom';

const withAuthentication = (Component) => {
    const Wrapped = (props) => {
        if (props.currentUser.profile) {
            return <Component {...props} />;
        }

        return <div className='statement'>
            <p>You need to sign in to see this page.</p>
            <div className='statement__footer'>
                <Link className='button button--primary hoverable' to={ROUTES.users.signIn}>
                    Sign in
                </Link>
            </div>
        </div>;
    };

    Wrapped.propTypes = {
        currentUser: PropTypes.object,
    }

    return Wrapped;
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

const withConnectedAuthentication = (Component) => connect(mapStateToProps)(withAuthentication(Component));

export default withConnectedAuthentication;
