import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import axios from 'axios';
import Listing from '../../app/components/listing/Listing';
import * as PropTypes from 'prop-types';
import getDeleteTicketPromise from '../../tickets/utils/getDeleteTicketPromise';
import {connect} from 'react-redux';

const guestTicketColumns = [
    {key: 'id', name: 'Id', centering: true},
    {key: 'room', name: 'Room', render: (r) => r.reservation.room.name},
    {key: 'dateFrom', name: 'Date from', render: (r) => r.reservation.dateFrom},
    {key: 'dateTo', name: 'Date to', isExtra: true, render: (r) => r.reservation.dateTo},
];

const GuestTickets = ({id, changeCounter, apiHeaders}) => {
    const [state, setState] = useState({
        tickets: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            let cancel = false;

            axios.get(getRouteWithParams(ROUTES.api.guestTickets, {id: id}), {
                headers: apiHeaders
            })
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
        <h2>Guest tickets</h2>
        <Listing
            error={state.error}
            isLoading={state.isLoading}
            rows={state.tickets}
            noRowsText='No tickets found.'
            columns={guestTicketColumns}
            actionsRoute={ROUTES.tickets}
            getDeletePromise={getDeleteTicketPromise}
            buttonText='Add new ticket'
            buttonUrl={ROUTES.tickets.add}
        />
    </React.Fragment>;
};

GuestTickets.propTypes = {
    id: PropTypes.number,
    changeCounter: PropTypes.number,
    apiHeaders: PropTypes.object,
};

const mapStateToProps = (state) => ({
    changeCounter: state.change.counter,
    apiHeaders: state.auth.apiHeaders,
});

export default connect(mapStateToProps)(GuestTickets);