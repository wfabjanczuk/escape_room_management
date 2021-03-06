import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import UserForm from '../components/UserForm';
import {get as _get} from 'lodash';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const UserDetails = ({currentUser}) => {
    const [userState, setUserState] = useState({
            user: {},
            isLoading: true,
            error: null,
        }),
        [guestState, setGuestState] = useState({
            guestId: 0,
            isLoading: true,
            error: null,
        }),
        params = useParams(),
        title = 'User details';

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.user, {id: params.id}), {
                headers: currentUser.apiHeaders,
            })
                .then(
                    (response) => setUserState({
                        user: response.data.user,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setUserState({
                        user: {},
                        isLoading: false,
                        error: error,
                    })
                )
        },
        [params]
    );

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.userGuest, {id: params.id}), {
                headers: currentUser.apiHeaders,
            })
                .then(
                    (response) => setGuestState({
                        guestId: response.data.guest.id,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setGuestState({
                        guestId: 0,
                        isLoading: false,
                        error: error,
                    })
                )
        },
        [params]
    );

    if (userState.error || guestState.error) {
        const errorMessage = _get(userState, 'error.message', '') + ' ' + _get(guestState, 'error.message', '');

        return <React.Fragment>
            <p>{errorMessage.trim()}</p>
        </React.Fragment>;
    }

    if (userState.isLoading || guestState.isLoading) {
        return <React.Fragment>
            <h2>{title}</h2>
            <p>Loading...</p>
        </React.Fragment>;
    }

    return <React.Fragment>
        <h2>{title}</h2>
        <UserForm
            user={userState.user}
            isDisabled={true}
            isProfile={false}
            formUserGuestId={guestState.guestId}
        />
    </React.Fragment>;
}

UserDetails.propTypes = {
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default withAuthorization(
    connect(mapStateToProps)(UserDetails),
    [ROLE_ADMIN]
);