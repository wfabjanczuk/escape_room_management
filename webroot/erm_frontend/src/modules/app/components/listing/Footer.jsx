import React from 'react';
import {Link} from 'react-router-dom';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';

const Footer = ({buttonText, buttonUrl, currentUser}) => (
    <div className='listing__footer'>
        {currentUser &&
            <Link className='button button--success button--wide hoverable' to={buttonUrl}>
                {buttonText}
            </Link>
        }
    </div>
);

Footer.propTypes = {
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(Footer);