import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import RoomForm from '../../rooms/components/RoomForm';
import RoomReservations from '../components/RoomReservations';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import {ROLE_ADMIN} from '../../app/constants/roles';
import RoomReviews from '../components/RoomReviews';

const RoomDetails = ({apiHeaders, currentUser}) => {
    const [state, setState] = useState({
            room: {},
            isLoading: true,
            error: null,
        }),
        params = useParams(),
        title = 'Room details';

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.room, {id: params.id}), {
                headers: apiHeaders,
            })
                .then(
                    (response) => setState({
                        room: response.data.room,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        room: {},
                        isLoading: false,
                        error: error,
                    })
                )
        },
        [params]
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
        <RoomForm room={state.room} isDisabled={true}/>
        <RoomReservations id={state.room.id}/>
        {currentUser && currentUser.roleId === ROLE_ADMIN &&
            <RoomReviews id={state.room.id}/>
        }
    </React.Fragment>;
}

RoomDetails.propTypes = {
    apiHeaders: PropTypes.object,
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    apiHeaders: state.auth.apiHeaders,
    currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(RoomDetails);