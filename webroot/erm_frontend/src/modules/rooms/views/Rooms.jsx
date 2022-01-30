import React, {useEffect, useState} from 'react';
import Listing from '../../app/components/listing/Listing';
import ROUTES from '../../app/constants/routes';
import axios from 'axios';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import getDeleteRoomPromise from '../utils/getDeleteRoomPromise';

const roomColumns = [
    {key: 'id', name: 'Id', centering: true},
    {key: 'name', name: 'Room name'},
    {key: 'baseTicketPrice', name: 'Base ticket price', render: (r) => parseFloat(r.baseTicketPrice).toFixed(2)},
    {
        key: 'averageRating',
        name: 'Avg. rating',
        isExtra: true,
        render: (r) => r.ratingsCount > 0
            ? parseFloat(r.averageRating).toFixed(2)
            : 'Not rated yet'
    },
];

const Rooms = ({currentUser, changeCounter}) => {
    const [state, setState] = useState({
        rooms: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            axios.get(ROUTES.api.rooms, {
                headers: currentUser.apiHeaders,
            })
                .then(
                    (response) => setState({
                        rooms: response.data.rooms,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        rooms: [],
                        isLoading: false,
                        error: error,
                    })
                );
        },
        [changeCounter]
    );

    return <React.Fragment>
        <h2>Room list</h2>
        <Listing
            error={state.error}
            isLoading={state.isLoading}
            rows={state.rooms}
            noRowsText='No rooms found.'
            columns={roomColumns}
            actionsRoute={ROUTES.rooms}
            getDeletePromise={getDeleteRoomPromise}
            buttonText='Add new room'
            buttonUrl={ROUTES.rooms.add}
        />
    </React.Fragment>;
};

Rooms.propTypes = {
    currentUser: PropTypes.object,
    changeCounter: PropTypes.number,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
    changeCounter: state.change.counter,
});

export default connect(mapStateToProps)(Rooms);