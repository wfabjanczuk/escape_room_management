import React, {useEffect, useState} from 'react';
import Listing from '../../app/components/listing/Listing';
import ROUTES from '../../app/constants/routes';
import axios from 'axios';
import getDeleteTicketPromise from '../utils/getDeleteTicketPromise';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const ticketColumns = [
    {key: 'id', name: 'Id', centering: true},
    {key: 'guest', name: 'Guest', render: (r) => `${r.guest.user.firstName} ${r.guest.user.lastName}`},
    {key: 'room', name: 'Room', render: (r) => r.reservation.room.name},
    {key: 'dateFrom', name: 'Date from', isExtra: true, render: (r) => r.reservation.dateFrom},
];

const Tickets = ({changeCounter, apiHeaders}) => {
    const [state, setState] = useState({
        tickets: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            axios.get(ROUTES.api.tickets, {
                headers: apiHeaders,
            })
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
        [changeCounter]
    );

    return <React.Fragment>
        <h2>Ticket list</h2>
        <Listing
            error={state.error}
            isLoading={state.isLoading}
            rows={state.tickets}
            noRowsText='No tickets found.'
            columns={ticketColumns}
            actionsRoute={ROUTES.tickets}
            getDeletePromise={getDeleteTicketPromise}
            buttonText='Add new ticket'
            buttonUrl={ROUTES.tickets.add}
        />
    </React.Fragment>;
};

Tickets.propTypes = {
    changeCounter: PropTypes.number,
    apiHeaders: PropTypes.object,
};

const mapStateToProps = (state) => ({
    changeCounter: state.change.counter,
    apiHeaders: state.auth.apiHeaders,
});

export default withAuthorization(
    connect(mapStateToProps)(Tickets),
    [ROLE_ADMIN]
);