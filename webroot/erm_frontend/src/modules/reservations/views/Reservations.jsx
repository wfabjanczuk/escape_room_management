import React, {useEffect, useState} from 'react';
import Listing from '../../app/components/listing/Listing';
import ROUTES from '../../app/constants/routes';
import axios from 'axios';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import getDeleteReservationPromise from '../utils/getDeleteReservationPromise';

const reservationColumns = [
    {key: 'id', name: 'Id', centering: true},
    {key: 'room', name: 'Room name', render: (r) => r.room.name},
    {key: 'dateFrom', name: 'Date from'},
    {key: 'dateTo', name: 'Date to', isExtra: true},
];

const Reservations = ({changeCounter}) => {
    const [state, setState] = useState({
        reservations: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            axios.get(ROUTES.api.reservations)
                .then(
                    (response) => setState({
                        reservations: response.data.reservations,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        reservations: [],
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
            rows={state.reservations}
            noRowsText='No reservations found.'
            columns={reservationColumns}
            actionsRoute={ROUTES.reservations}
            getDeletePromise={getDeleteReservationPromise}
            buttonText='Add new reservation'
            buttonUrl={ROUTES.reservations.add}
        />
    </React.Fragment>;
};

Reservations.propTypes = {
    changeCounter: PropTypes.number,
};

const mapStateToProps = (state) => ({
    changeCounter: state.change.counter,
});

export default connect(mapStateToProps)(Reservations);