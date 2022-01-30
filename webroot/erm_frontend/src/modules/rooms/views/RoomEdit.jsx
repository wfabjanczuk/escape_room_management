import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import RoomForm from '../../rooms/components/RoomForm';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const RoomEdit = ({currentUser}) => {
    const [state, setState] = useState({
            room: {},
            isLoading: true,
            error: null,
        }),
        params = useParams(),
        title = 'Edit room';

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.room, {id: params.id}), {
                headers: currentUser.apiHeaders,
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
        <RoomForm room={state.room} isDisabled={false}/>
    </React.Fragment>;
}

RoomEdit.propTypes = {
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default withAuthorization(
    connect(mapStateToProps)(RoomEdit),
    [ROLE_ADMIN]
);