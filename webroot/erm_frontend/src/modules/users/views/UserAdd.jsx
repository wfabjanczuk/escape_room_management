import React from 'react';
import UserForm from '../components/UserForm';
import withAuthentication from '../../app/auth/withAuthentication';

const UserAdd = () => {
    return <React.Fragment>
        <h2>New user</h2>
        <UserForm user={null} isDisabled={false} isProfile={false}/>
    </React.Fragment>;
}

export default withAuthentication(UserAdd);