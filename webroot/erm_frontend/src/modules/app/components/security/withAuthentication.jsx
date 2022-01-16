import React from 'react';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';

const withAuthentication = (Component) => {
    const Wrapped = (props) => {
        if (!props.currentUser) {
            return <div className='statement'>
                <p>You need to sign in to see this page.</p>
                <div className='statement__footer'>
                    <button className='button button--primary button--wide hoverable'>
                        Sign in
                    </button>
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
    currentUser: state.user.currentUser,
});

const withConnectedAuthentication = (Component) => connect(mapStateToProps)(withAuthentication(Component));

export default withConnectedAuthentication;
