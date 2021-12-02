import React from 'react';
import {Link} from 'react-router-dom';
import * as PropTypes from 'prop-types';

const Footer = ({buttonText, buttonUrl}) => (<div className='listing__footer'>
    <Link className='button button--success button--wide hoverable' to={buttonUrl}>
        {buttonText}
    </Link>
</div>);

Footer.propTypes = {
    entityExists: PropTypes.bool,
    cancelUrl: PropTypes.string,
};

export default Footer;