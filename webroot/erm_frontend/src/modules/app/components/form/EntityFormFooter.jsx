import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import * as PropTypes from 'prop-types';
import {addErrorMessage, addSuccessMessage} from '../../../redux/flash/flashActions';
import {increaseChangeCounter} from '../../../redux/change/changeActions';
import {connect} from 'react-redux';

const EntityFormFooter = (
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
                Delete
            </div>
        </div>;
    }

    return <div className='form__footer'>
        {error && <span className='form__error form__error--summary'>{error}</span>}
        <input className='button button--success hoverable' type='submit' value={entityExists ? 'Save' : 'Add'}/>
        <Link className='button button--secondary hoverable' to={redirectUrl}>
            Cancel
        </Link>
    </div>;
};

EntityFormFooter.propTypes = {
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

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
    addErrorMessage: (content) => dispatch(addErrorMessage(content)),
    increaseChangeCounter: () => dispatch(increaseChangeCounter()),
});

export default connect(null, mapDispatchToProps)(EntityFormFooter);
