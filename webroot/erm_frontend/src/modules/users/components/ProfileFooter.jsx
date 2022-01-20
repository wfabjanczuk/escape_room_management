import React from 'react';
import * as PropTypes from 'prop-types';
import {Link, useNavigate} from 'react-router-dom';

const ProfileFooter = (
    {
        id,
        entityExists,
        editUrl,
        redirectUrl,
        isDisabled,
        getDeletePromise,
        error,
        addSuccessMessage,
        addErrorMessage,
        increaseChangeCounter
    }
) => {
    const navigate = useNavigate();

    if (isDisabled) {
        const onDelete = () => getDeletePromise(id, addSuccessMessage, addErrorMessage)
            .then(() => navigate(redirectUrl))
            .finally(() => increaseChangeCounter());

        return <div className='form__footer'>
            <Link className='button button--warning hoverable' to={editUrl}>
                Edit
            </Link>
            <div className='button button--danger hoverable' onClick={onDelete}>
                Delete account
            </div>
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
    id: PropTypes.number,
    entityExists: PropTypes.bool,
    editUrl: PropTypes.string,
    redirectUrl: PropTypes.string,
    isDisabled: PropTypes.bool,
    getDeletePromise: PropTypes.func,
    error: PropTypes.string,
    addSuccessMessage: PropTypes.func,
    addErrorMessage: PropTypes.func,
    increaseChangeCounter: PropTypes.func,
};

export default ProfileFooter;
