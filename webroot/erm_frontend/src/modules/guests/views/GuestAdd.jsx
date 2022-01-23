import React from 'react';
import GuestForm from '../components/GuestForm';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const GuestAdd = () => {
    return <React.Fragment>
        <h2>New guest</h2>
        <GuestForm guest={null} isDisabled={false}/>
    </React.Fragment>;
}

export default withAuthorization(
    GuestAdd,
    [ROLE_ADMIN]
);