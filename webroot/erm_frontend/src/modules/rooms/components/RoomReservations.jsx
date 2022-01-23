import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import axios from 'axios';
import Listing from '../../app/components/listing/Listing';
import * as PropTypes from 'prop-types';
import getDeleteReservationPromise from '../../reservations/utils/getDeleteReservationPromise';
import {connect} from 'react-redux';
import {ROLE_ADMIN} from '../../app/constants/roles';

const roomReservationColumns = [
    {key: 'id', name: 'Id', centering: true},
    {key: 'dateFrom', name: 'Date from'},
    {key: 'dateTo', name: 'Date to', isExtra: true},
    {key: 'totalPrice', name: 'Total price', render: (r) => parseFloat(r.totalPrice).toFixed(2)},
];

const RoomReservations = ({id, currentUser, changeCounter, apiHeaders}) => {
    if (!currentUser || currentUser.roleId !== ROLE_ADMIN) {
        return null;
    }

    const [state, setState] = useState({
        reservations: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            let cancel = false;

            axios.get(getRouteWithParams(ROUTES.api.roomReservations, {id: id}), {
                headers: apiHeaders,
            })
                .then(
                    (response) => {
                        if (cancel) {
                            return;
                        }

                        setState({
                            reservations: response.data.reservations,
                            isLoading: false,
                            error: null,
                        });
                    },
                    (error) => {
                        if (cancel) {
                            return;
                        }

                        setState({
                            reservations: [],
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
        <h2>Room reservations</h2>
        <Listing
            error={state.error}
            isLoading={state.isLoading}
            rows={state.reservations}
            noRowsText='No reservations found.'
            columns={roomReservationColumns}
            actionsRoute={ROUTES.reservations}
            getDeletePromise={getDeleteReservationPromise}
            buttonText='Add new reservation'
            buttonUrl={ROUTES.reservations.add}
        />
    </React.Fragment>;
};

RoomReservations.propTypes = {
    id: PropTypes.number,
    currentUser: PropTypes.object,
    changeCounter: PropTypes.number,
    apiHeaders: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
    changeCounter: state.change.counter,
    apiHeaders: state.auth.apiHeaders,
});

export default connect(mapStateToProps)(RoomReservations);