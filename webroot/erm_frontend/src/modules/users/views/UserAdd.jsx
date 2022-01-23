import React from 'react';
import UserForm from '../components/UserForm';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const UserAdd = () => {
    return <React.Fragment>
        <h2>New user</h2>
        <UserForm user={null} isDisabled={false} isProfile={false}/>
    </React.Fragment>;
}

export default withAuthorization(
    UserAdd,
    [ROLE_ADMIN]
);