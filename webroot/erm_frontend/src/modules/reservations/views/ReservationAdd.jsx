import React from 'react';
import ReservationForm from '../components/ReservationForm';
import withAuthentication from '../../app/auth/withAuthentication';

const ReservationAdd = () => {
    return <React.Fragment>
        <h2>New reservation</h2>
        <ReservationForm reservation={null} isDisabled={false}/>
    </React.Fragment>;
}

export default withAuthentication(ReservationAdd);