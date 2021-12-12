import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import axios from 'axios';
import Listing from '../../app/components/listing/Listing';
import * as PropTypes from 'prop-types';
import getDeleteTicketPromise from '../../tickets/utils/getDeleteTicketPromise';
import {connect} from "react-redux";

const guestTicketColumns = [
    {key: 'id', name: 'Id', centering: true},
    {key: 'room', name: 'Room', render: (r) => r.reservation.room.name},
    {key: 'dateFrom', name: 'Date from', render: (r) => r.reservation.dateFrom},
    {key: 'dateTo', name: 'Date to', isExtra: true, render: (r) => r.reservation.dateTo},
];

const GuestTickets = ({id, changeCounter}) => {
    const [state, setState] = useState({
        tickets: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.guestTickets, {id: id}))
                .then(
                    (response) => setState({
                        tickets: response.data.tickets,
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
        [id, changeCounter]
    );

    return <React.Fragment>
        <h2>Guest tickets</h2>
        <Listing
            error={state.error}
            isLoading={state.isLoading}
            rows={state.tickets}
            noRowsText='No tickets found.'
            columns={guestTicketColumns}
            actionsRoute={ROUTES.tickets}
            getDeletePromise={getDeleteTicketPromise}
            buttonText='Create new ticket'
            buttonUrl={ROUTES.tickets.add}
        />
    </React.Fragment>;
};

GuestTickets.propTypes = {
    id: PropTypes.number,
    changeCounter: PropTypes.number,
};

const mapStateToProps = (state) => ({
    changeCounter: state.change.counter,
});

export default connect(mapStateToProps)(GuestTickets);