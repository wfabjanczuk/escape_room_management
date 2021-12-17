import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import axios from 'axios';
import Listing from '../../app/components/listing/Listing';
import * as PropTypes from 'prop-types';
import getDeleteTicketPromise from '../../tickets/utils/getDeleteTicketPromise';
import {connect} from 'react-redux';

const reservationTicketColumns = [
    {key: 'id', name: 'Id', centering: true},
    {key: 'guest', name: 'Guest', render: (r) => `${r.guest.firstName} ${r.guest.lastName}`},
    {key: 'price', name: 'Price', render: (r) => parseFloat(r.price).toFixed(2)},
    {
        key: 'guestAllowedToCancel',
        name: 'Allowed to cancel',
        isExtra: true,
        render: (r) => r.guestAllowedToCancel ? 'Yes' : 'No'
    },
];

const ReservationTickets = ({id, changeCounter}) => {
    const [state, setState] = useState({
        tickets: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            let cancel = false;

            axios.get(getRouteWithParams(ROUTES.api.reservationTickets, {id: id}))
                .then(
                    (response) => {
                        if (cancel) {
                            return;
                        }

                        setState({
                            tickets: response.data.tickets,
                            isLoading: false,
                            error: null,
                        });
                    },
                    (error) => {
                        if (cancel) {
                            return;
                        }

                        setState({
                            tickets: [],
                            isLoading: false,
                            error: error,
                        });
                    }
                );

            return () => {
                cancel = true;
            };
        },
        [id, changeCounter]
    );

    return <React.Fragment>
        <h2>Reservation tickets</h2>
        <Listing
            error={state.error}
            isLoading={state.isLoading}
            rows={state.tickets}
            noRowsText='No tickets found.'
            columns={reservationTicketColumns}
            actionsRoute={ROUTES.tickets}
            getDeletePromise={getDeleteTicketPromise}
            buttonText='Create new ticket'
            buttonUrl={ROUTES.tickets.add}
        />
    </React.Fragment>;
};

ReservationTickets.propTypes = {
    id: PropTypes.number,
    changeCounter: PropTypes.number,
};

const mapStateToProps = (state) => ({
    changeCounter: state.change.counter,
});

export default connect(mapStateToProps)(ReservationTickets);