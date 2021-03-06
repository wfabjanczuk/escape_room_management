import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import UserForm from '../components/UserForm';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const UserEdit = ({currentUser}) => {
    const [state, setState] = useState({
            user: {},
            isLoading: true,
            error: null,
        }),
        params = useParams(),
        title = 'Edit user';

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.user, {id: params.id}), {
                headers: currentUser.apiHeaders,
            })
                .then(
                    (response) => setState({
                        user: response.data.user,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        user: {},
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
        <UserForm user={state.user} isDisabled={false} isProfile={false}/>
    </React.Fragment>;
}

UserEdit.propTypes = {
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default withAuthorization(
    connect(mapStateToProps)(UserEdit),
    [ROLE_ADMIN]
);