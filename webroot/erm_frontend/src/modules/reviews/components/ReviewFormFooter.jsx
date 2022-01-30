import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import * as PropTypes from 'prop-types';
import {addErrorMessage, addSuccessMessage} from '../../app/redux/flash/flashActions';
import {increaseChangeCounter} from '../../app/redux/change/changeActions';
import {connect} from 'react-redux';
import {ROLE_ADMIN} from '../../app/constants/roles';
import {showModal} from '../../app/redux/modal/modalActions';
import isAuthorized from '../../app/auth/isAuthorized';

const ReviewFormFooter = (
    {
        id,
        entityExists,
        editUrl,
        redirectUrl,
        isDisabled,
        getDeletePromise,
        error,
        extraButtons,
        currentUser,
        addSuccessMessage,
        addErrorMessage,
        increaseChangeCounter,
        showModal,
    }
) => {
    const navigate = useNavigate();

    if (!currentUser.profile) {
        return <div className='form__footer'>
            <Link className='button button--primary hoverable' to={redirectUrl}>
                Back to list
            </Link>
            {extraButtons}
        </div>;
    }

    if (isDisabled) {
        const onDelete = () => getDeletePromise(id, currentUser.apiHeaders, addSuccessMessage, addErrorMessage)
            .then(() => navigate(redirectUrl))
            .finally(() => increaseChangeCounter());

        return <div className='form__footer'>
            {(isAuthorized(currentUser, [ROLE_ADMIN]) || currentUser.guestId > 0)
                ? <React.Fragment>
                    <Link className='button button--warning hoverable' to={editUrl}>
                        Edit
                    </Link>
                    <div className='button button--danger hoverable' onClick={() => showModal(onDelete)}>
                        Delete
                    </div>
                </React.Fragment>
                : <Link className='button button--primary hoverable' to={redirectUrl}>
                    Back to list
                </Link>
            }
            {extraButtons}
        </div>;
    }

    return <div className='form__footer'>
        {error && <span className='form__error form__error--summary'>{error}</span>}
        <input className='button button--success hoverable' type='submit' value={entityExists ? 'Save' : 'Add'}/>
        <Link className='button button--secondary hoverable' to={redirectUrl}>
            Cancel
        </Link>
        {extraButtons}
    </div>;
};

ReviewFormFooter.propTypes = {
    id: PropTypes.number,
    entityExists: PropTypes.bool,
    editUrl: PropTypes.string,
    redirectUrl: PropTypes.string,
    isDisabled: PropTypes.bool,
    getDeletePromise: PropTypes.func,
    error: PropTypes.string,
    extraButtons: PropTypes.node,
    currentUser: PropTypes.object,
    addSuccessMessage: PropTypes.func,
    addErrorMessage: PropTypes.func,
    increaseChangeCounter: PropTypes.func,
    showModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
    addErrorMessage: (content) => dispatch(addErrorMessage(content)),
    increaseChangeCounter: () => dispatch(increaseChangeCounter()),
    showModal: (onConfirm) => dispatch(showModal(onConfirm)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewFormFooter);
