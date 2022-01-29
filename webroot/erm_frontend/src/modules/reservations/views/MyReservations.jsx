import React, {useEffect, useState} from 'react';
import Listing from '../../app/components/listing/Listing';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import axios from 'axios';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_GUEST} from '../../app/constants/roles';
import {Link} from 'react-router-dom';
import getCancelReservationPromise from '../utils/getCancelReservationPromise';
import {addErrorMessage, addSuccessMessage} from '../../app/redux/flash/flashActions';
import {increaseChangeCounter} from '../../app/redux/change/changeActions';
import {showModal} from '../../app/redux/modal/modalActions';

const ticketColumns = [
    {key: 'id', name: 'Id', centering: true, render: (r) => r.reservation.id},
    {key: 'room', name: 'Room', render: (r) => r.reservation.room.name},
    {key: 'dateFrom', name: 'Date from', isExtra: false, render: (r) => r.reservation.dateFrom},
    {key: 'isCancelled', name: 'Cancelled', isExtra: true, render: (r) => r.reservation.dateCancelled ? 'Yes' : 'No'},
];

const MyReservations = (
    {
        changeCounter,
        guestId,
        apiHeaders,
        addSuccessMessage,
        addErrorMessage,
        increaseChangeCounter,
        showModal,
    }
) => {
    const [state, setState] = useState({
        tickets: [],
        isLoading: true,
        error: null,
    });

    const actionsRenderer = (row) => {
        const onCancel = () => getCancelReservationPromise(row.reservation.id, apiHeaders, addSuccessMessage, addErrorMessage)
            .finally(() => increaseChangeCounter());

        return <ul className='listing__actions'>
            <li className='action'>
                <Link className='button button--primary hoverable'
                      to={getRouteWithParams(ROUTES.reservations.details, {id: row.reservation.id})}>
                    Details
                </Link>
            </li>
            {row.guestAllowedToCancel && !row.reservation.dateCancelled &&
                <React.Fragment>
                    <li className='action'>
                        <div className='button button--danger hoverable' onClick={() => showModal(onCancel)}>
                            Cancel
                        </div>
                    </li>
                </React.Fragment>
            }
        </ul>;
    }

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.guestTickets, {id: guestId}), {
                headers: apiHeaders,
            })
                .then(
                    (response) => setState({
                        tickets: response.data.tickets.map(
                            (ticket) => ({
                                ...ticket,
                                cancelled: !!ticket.reservation.dateCancelled,
                            })
                        ),
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        tickets: [],
                        isLoading: false,
                        error: error,
                    })
                );
        },
        [changeCounter]
    );

    return <React.Fragment>
        <h2>Reservation list</h2>
        <Listing
            error={state.error}
            isLoading={state.isLoading}
            rows={state.tickets}
            noRowsText='You have no reservations.'
            columns={ticketColumns}
            actionsRoute={ROUTES.reservations}
            getDeletePromise={null}
            buttonText='Add new reservation'
            buttonUrl={ROUTES.reservations.add}
            actionsRenderer={actionsRenderer}
        />
    </React.Fragment>;
};

MyReservations.propTypes = {
    changeCounter: PropTypes.number,
    guestId: PropTypes.number,
    apiHeaders: PropTypes.object,
    addSuccessMessage: PropTypes.func,
    addErrorMessage: PropTypes.func,
    increaseChangeCounter: PropTypes.func,
    showModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
    changeCounter: state.change.counter,
    guestId: state.auth.guestId,
    apiHeaders: state.auth.apiHeaders,
});

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
    addErrorMessage: (content) => dispatch(addErrorMessage(content)),
    increaseChangeCounter: () => dispatch(increaseChangeCounter()),
    showModal: (onConfirmCallback) => dispatch(showModal(onConfirmCallback)),
});

export default withAuthorization(
    connect(mapStateToProps, mapDispatchToProps)(MyReservations),
    [ROLE_GUEST]
);