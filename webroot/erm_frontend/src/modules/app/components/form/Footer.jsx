import React from 'react';
import {Link} from 'react-router-dom';
import * as PropTypes from 'prop-types';

const Footer = ({entityExists, redirectUrl, isDisabled, error}) => {
    if (isDisabled) {
        return <div className='form__footer'>
            <Link className='button button--warning hoverable' to={redirectUrl}>
                Edit
            </Link>
        </div>;
    }

    return <div className='form__footer'>
        {error && <span className='form__error form__error--summary'>{error}</span>}
        <input className='button button--success hoverable' type='submit' value={entityExists ? 'Save' : 'Create'}/>
        <Link className='button button--secondary hoverable' to={redirectUrl}>
            Cancel
        </Link>
    </div>;
};

Footer.propTypes = {
    entityExists: PropTypes.bool,
    redirectUrl: PropTypes.string,
    isDisabled: PropTypes.bool,
    error: PropTypes.string,
};

export default Footer;