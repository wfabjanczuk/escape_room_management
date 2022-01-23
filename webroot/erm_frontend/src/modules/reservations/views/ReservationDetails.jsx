import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import ReservationForm from '../components/ReservationForm';
import ReservationTickets from '../components/ReservationTickets';
import RoomForm from '../../rooms/components/RoomForm';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN, ROLE_GUEST} from '../../app/constants/roles';

const ReservationDetails = ({changeCounter, guestId, apiHeaders}) => {
    const [state, setState] = useState({
            reservation: {},
            isLoading: true,
            error: null,
        }),
        [ticketsState, setTicketsState] = useState({
            tickets: [],
            isLoading: true,
            error: null,
        }),
        id = state.reservation.id,
        allowedToCancel = guestId && ticketsState.tickets.some(
            (t) => t.guestId === guestId && t.guestAllowedToCancel
        ),
        params = useParams(),
        title = 'Reservation details';

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.reservation, {id: params.id}), {
                headers: apiHeaders,
            })
                .then(
                    (response) => setState({
                        reservation: response.data.reservation,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        reservation: {},
                        isLoading: false,
                        error: error,
                    })
                )
        },
        [params, changeCounter]
    );

    useEffect(() => {
            if (!id) {
                return;
            }

            let cancel = false;

            axios.get(getRouteWithParams(ROUTES.api.reservationTickets, {id: id}), {
                headers: apiHeaders,
            })
                .then(
                    (response) => {
                        if (cancel) {
                            return;
                        }

                        setTicketsState({
                            tickets: response.data.tickets,
                            isLoading: false,
                            error: null,
                        });
                    },
                    (error) => {
                        if (cancel) {
                            return;
                        }

                        setTicketsState({
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

    if (state.error) {
        return <React.Fragment>
            <h2>{title}</h2>
            <p>{state.error.message}</p>
        </React.Fragment>;
    }

    if (state.isLoading) {
        return <React.Fragment>
            <h2>{title}</h2>
            <p>Loading...</p>
        </React.Fragment>;
    }

    return <React.Fragment>
        <h2>{title}</h2>
        <ReservationForm reservation={state.reservation} isDisabled={true} allowedToCancel={allowedToCancel}/>
        <h2>Reservation room</h2>
        <RoomForm room={state.reservation.room} isDisabled={true} showFooter={false}/>
        <ReservationTickets ticketsState={ticketsState}/>
    </React.Fragment>;
};

ReservationDetails.propTypes = {
    changeCounter: PropTypes.number,
    guestId: PropTypes.number,
    apiHeaders: PropTypes.object,
};

const mapStateToProps = (state) => ({
    changeCounter: state.change.counter,
    guestId: state.auth.guestId,
    apiHeaders: state.auth.apiHeaders,
});

export default withAuthorization(
    connect(mapStateToProps)(ReservationDetails),
    [ROLE_GUEST, ROLE_ADMIN]
);