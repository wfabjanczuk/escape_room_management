import {connect} from 'react-redux';
import React from 'react';
import withAuthentication from './withAuthentication';
import {Link} from 'react-router-dom';
import ROUTES from '../constants/routes';
import isAuthorized from './isAuthorized';
import * as PropTypes from 'prop-types';

const withAuthorization = (Component) => {
    const Wrapped = (props) => {
        if (!props.requiredPrivileges || !isAuthorized(props.currentUser, props.requiredPrivileges)) {
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
        requiredPrivileges: PropTypes.object,
        currentUser: PropTypes.object,
    }

    return Wrapped;
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

const withConnectedAuthorization = (Component) => connect(mapStateToProps)(withAuthorization(withAuthentication(Component)));

export default withConnectedAuthorization;
