import React from 'react';
import ReservationForm from '../components/ReservationForm';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const ReservationAdd = () => {
    return <React.Fragment>
        <h2>New reservation</h2>
        <ReservationForm reservation={null} isDisabled={false}/>
    </React.Fragment>;
}

export default withAuthorization(
    ReservationAdd,
    [ROLE_ADMIN]
);