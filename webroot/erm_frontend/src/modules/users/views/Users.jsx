import React, {useEffect, useState} from 'react';
import Listing from '../../app/components/listing/Listing';
import ROUTES from '../../app/constants/routes';
import axios from 'axios';
import getDeleteUserPromise from '../utils/getDeleteUserPromise';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const userColumns = [
    {key: 'id', name: 'Id', isExtra: false, centering: true},
    {key: 'email', name: 'Email', isExtra: false},
    {key: 'role', name: 'Role', isExtra: false, render: (u) => u.role.name},
    {key: 'isActive', name: 'Active', isExtra: true, render: (u) => u.isActive ? 'Yes' : 'No'},
];

const Users = ({currentUser, changeCounter}) => {
    const [state, setState] = useState({
        users: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            axios.get(ROUTES.api.users, {
                headers: currentUser.apiHeaders,
            })
                .then(
                    (response) => setState({
                        users: response.data.users,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        users: [],
                        isLoading: false,
                        error: error,
                    })
                );
        },
        [changeCounter]
    );

    return <React.Fragment>
        <h2>User list</h2>
        <Listing
            error={state.error}
            isLoading={state.isLoading}
            rows={state.users}
            noRowsText='No users found.'
            columns={userColumns}
            actionsRoute={ROUTES.users}
            getDeletePromise={getDeleteUserPromise}
            buttonText='Add new user'
            buttonUrl={ROUTES.users.add}
        />
    </React.Fragment>;
};

Users.propTypes = {
    currentUser: PropTypes.object,
    changeCounter: PropTypes.number,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
    changeCounter: state.change.counter,
});

export default withAuthorization(
    connect(mapStateToProps)(Users),
    [ROLE_ADMIN]
);