import {connect} from 'react-redux';
import React from 'react';
import withAuthentication from './withAuthentication';
import {Link} from 'react-router-dom';
import ROUTES from '../constants/routes';
import isAuthorized from './isAuthorized';
import * as PropTypes from 'prop-types';

const withAuthorization = (Component, allowedRoles) => {
    const Wrapped = (props) => {
        if (!allowedRoles || !isAuthorized(props.currentUser, allowedRoles)) {
            return <div className='statement'>
                <p>You are not authorized to see this page.</p>
                <div className='statement__footer'>
                    <Link className='button button--primary button--wide hoverable' to={ROUTES.home}>
                        Return to home page
                    </Link>
                </div>
            </div>;
        }

        return <Component {...props} />
    };

    Wrapped.propTypes = {
        currentUser: PropTypes.object,
    }

    return Wrapped;
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

const withConnectedAuthorization = (Component, allowedRoles) => connect(mapStateToProps)(
    withAuthorization(
        withAuthentication(Component),
        allowedRoles
    )
);

export default withConnectedAuthorization;
