import React from 'react';
import GuestForm from '../components/GuestForm';
import withAuthentication from '../../app/auth/withAuthentication';

const GuestAdd = () => {
    return <React.Fragment>
        <h2>New guest</h2>
        <GuestForm guest={null} isDisabled={false}/>
    </React.Fragment>;
}

export default withAuthentication(GuestAdd);