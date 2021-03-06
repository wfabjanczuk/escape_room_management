import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addErrorMessage, addSuccessMessage} from '../../app/redux/flash/flashActions';
import {increaseChangeCounter} from '../../app/redux/change/changeActions';
import getCancelReservationPromise from '../utils/getCancelReservationPromise';
import {get as _get} from 'lodash';
import {showModal} from '../../app/redux/modal/modalActions';
import moment from 'moment';
import {API_DATE_FORMAT} from '../../app/constants/dates';

const ReservationFormFooter = (
    {
        reservation,
        entityExists,
        allowedToCancel,
        editUrl,
        redirectUrl,
        isDisabled,
        getDeletePromise,
        error,
        currentUser,
        addSuccessMessage,
        addErrorMessage,
        increaseChangeCounter,
        showModal,
    }
) => {
    const navigate = useNavigate(),
        id = parseInt(_get(reservation, 'id', null), 10),
        dateCancelled = _get(reservation, 'dateCancelled', null),
        dateFrom = _get(reservation, 'dateFrom', null);

    if (isDisabled) {
        if (currentUser.guestId === 0) {
            const onDelete = () => getDeletePromise(id, currentUser.apiHeaders, addSuccessMessage, addErrorMessage)
                .then(() => navigate(redirectUrl))
                .finally(() => increaseChangeCounter());

            return <div className='form__footer'>
                <Link className='button button--warning hoverable' to={editUrl}>
                    Edit
                </Link>
                <div className='button button--danger hoverable' onClick={() => showModal(onDelete)}>
                    Delete
                </div>
            </div>;
        }

        const onCancel = () => getCancelReservationPromise(id, currentUser.apiHeaders, addSuccessMessage, addErrorMessage)
            .finally(() => increaseChangeCounter());

        return <div className='form__footer'>
            <Link className='button button--primary hoverable' to={redirectUrl}>
                Back to list
            </Link>
            {!dateCancelled && allowedToCancel && moment(dateFrom, API_DATE_FORMAT).isAfter(new Date()) &&
                <div className='button button--danger hoverable' onClick={() => showModal(onCancel)}>
                    Cancel
                </div>
            }
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

ReservationFormFooter.propTypes = {
    reservation: PropTypes.object,
    entityExists: PropTypes.bool,
    allowedToCancel: PropTypes.bool,
    editUrl: PropTypes.string,
    redirectUrl: PropTypes.string,
    isDisabled: PropTypes.bool,
    getDeletePromise: PropTypes.func,
    error: PropTypes.string,
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

export default connect(mapStateToProps, mapDispatchToProps)(ReservationFormFooter);
