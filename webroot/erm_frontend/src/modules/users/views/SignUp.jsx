import React from 'react';
import UserForm from '../components/UserForm';

export default function SignUp() {
    return <React.Fragment>
        <h2>Sign up</h2>
        <UserForm user={null} isDisabled={false} isProfile={true}/>
    </React.Fragment>;
}