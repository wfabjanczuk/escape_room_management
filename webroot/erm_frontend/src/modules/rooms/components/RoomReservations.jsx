import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import axios from 'axios';
import Listing from '../../app/components/listing/Listing';
import * as PropTypes from 'prop-types';
import getDeleteReservationPromise from '../../reservations/utils/getDeleteReservationPromise';
import {connect} from 'react-redux';

const roomReservationColumns = [
    {key: 'id', name: 'Id', centering: true},
    {key: 'dateFrom', name: 'Date from'},
    {key: 'dateTo', name: 'Date to', isExtra: true},
    {key: 'totalPrice', name: 'Total price', render: (r) => parseFloat(r.totalPrice).toFixed(2)},
];

const RoomReservations = ({id, changeCounter}) => {
    const [state, setState] = useState({
        reservations: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            let cancel = false;

            axios.get(getRouteWithParams(ROUTES.api.roomReservations, {id: id}))
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
    changeCounter: PropTypes.number,
};

const mapStateToProps = (state) => ({
    changeCounter: state.change.counter,
});

export default connect(mapStateToProps)(RoomReservations);