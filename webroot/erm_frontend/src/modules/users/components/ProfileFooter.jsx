import React from 'react';
import * as PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const ProfileFooter = (
    {
        entityExists,
        editUrl,
        redirectUrl,
        isDisabled,
        error,
    }
) => {
    if (isDisabled) {
        return <div className='form__footer'>
            <Link className='button button--warning hoverable' to={editUrl}>
                Edit
            </Link>
        </div>;
    }

    return <div className='form__footer'>
        {error && <span className='form__error form__error--summary'>{error}</span>}
        <input type='submit'
               className={`button button--success ${entityExists ? '' : ' button--wide'} hoverable`}
               value={entityExists ? 'Save' : 'Create guest account'}
        />
        {entityExists && <Link className='button button--secondary hoverable' to={redirectUrl}>
            Cancel
        </Link>}
    </div>;
};

ProfileFooter.propTypes = {
    entityExists: PropTypes.bool,
    editUrl: PropTypes.string,
    redirectUrl: PropTypes.string,
    isDisabled: PropTypes.bool,
    error: PropTypes.string,
};

export default ProfileFooter;
