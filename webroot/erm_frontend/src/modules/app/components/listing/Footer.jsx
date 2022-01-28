import React from 'react';
import {Link} from 'react-router-dom';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {ROLE_ADMIN, ROLE_GUEST} from '../../constants/roles';

const Footer = ({buttonText, buttonUrl, isGuestAuthorized, currentUser}) => (
    <div className='listing__footer'>
        {currentUser && (currentUser.roleId === ROLE_ADMIN || currentUser.roleId === ROLE_GUEST && isGuestAuthorized) &&
            <Link className='button button--success button--wide hoverable' to={buttonUrl}>
                {buttonText}
            </Link>
        }
    </div>
);

Footer.propTypes = {
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
    isGuestAuthorized: PropTypes.bool,
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(Footer);