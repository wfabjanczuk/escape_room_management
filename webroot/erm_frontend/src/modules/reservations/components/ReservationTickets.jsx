import React from 'react';
import ROUTES from '../../app/constants/routes';
import Listing from '../../app/components/listing/Listing';
import * as PropTypes from 'prop-types';
import getDeleteTicketPromise from '../../tickets/utils/getDeleteTicketPromise';
import {connect} from 'react-redux';

const reservationTicketColumns = [
    {key: 'id', name: 'Id', centering: true},
    {key: 'guest', name: 'Guest', render: (r) => `${r.guest.user.firstName} ${r.guest.user.lastName}`},
    {key: 'price', name: 'Price', render: (r) => parseFloat(r.price).toFixed(2)},
    {
        key: 'guestAllowedToCancel',
        name: 'Allowed to cancel',
        isExtra: true,
        render: (r) => r.guestAllowedToCancel ? 'Yes' : 'No'
    },
];

const ReservationTickets = ({ticketsState, guestId}) => {
    return <React.Fragment>
        <h2>Reservation tickets</h2>
        <Listing
            error={ticketsState.error}
            isLoading={ticketsState.isLoading}
            rows={ticketsState.tickets}
            noRowsText='No tickets found.'
            columns={reservationTicketColumns}
            actionsRoute={ROUTES.tickets}
            getDeletePromise={getDeleteTicketPromise}
            buttonText='Add new ticket'
            buttonUrl={ROUTES.tickets.add}
            renderActions={!guestId}
        />
    </React.Fragment>;
};

ReservationTickets.propTypes = {
    ticketsState: PropTypes.object,
    guestId: PropTypes.number,
};

const mapStateToProps = (state) => ({
    guestId: state.auth.guestId,
});

export default connect(mapStateToProps)(ReservationTickets);