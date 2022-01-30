import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import GuestForm from '../components/GuestForm';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const GuestEdit = ({currentUser}) => {
    const [state, setState] = useState({
            guest: {},
            isLoading: true,
            error: null,
        }),
        params = useParams(),
        title = 'Edit guest';

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.guest, {id: params.id}), {
                headers: currentUser.apiHeaders,
            })
                .then(
                    (response) => setState({
                        guest: response.data.guest,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        guest: {},
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
        <GuestForm guest={state.guest} isDisabled={false}/>
    </React.Fragment>;
}

GuestEdit.propTypes = {
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default withAuthorization(
    connect(mapStateToProps)(GuestEdit),
    [ROLE_ADMIN]
);