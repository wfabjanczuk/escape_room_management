import React from 'react';
import SignInForm from '../components/SignInForm';
import DemonstrationNote from './DemonstrationNote';

export default function SignIn() {
    return <React.Fragment>
        <h2>Sign in</h2>
        <SignInForm/>
        <DemonstrationNote/>
    </React.Fragment>;
}