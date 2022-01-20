import React from 'react';
import UserForm from '../components/UserForm';

export default function UserAdd() {
    return <React.Fragment>
        <h2>New user</h2>
        <UserForm user={null} isDisabled={false} isProfile={false}/>
    </React.Fragment>;
}