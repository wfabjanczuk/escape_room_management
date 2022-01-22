import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import RoomForm from '../../rooms/components/RoomForm';
import withAuthentication from '../../app/auth/withAuthentication';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';

const RoomEdit = ({apiHeaders}) => {
    const [state, setState] = useState({
            room: {},
            isLoading: true,
            error: null,
        }),
        params = useParams(),
        title = 'Edit room';

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
        <RoomForm room={state.room} isDisabled={false}/>
    </React.Fragment>;
}

RoomEdit.propTypes = {
    apiHeaders: PropTypes.object,
};

const mapStateToProps = (state) => ({
    apiHeaders: state.auth.apiHeaders,
});

export default withAuthentication(connect(mapStateToProps)(RoomEdit));