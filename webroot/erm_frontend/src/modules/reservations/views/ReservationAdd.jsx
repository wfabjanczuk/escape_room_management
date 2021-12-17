import React from 'react';
import ReservationForm from '../components/ReservationForm';

export default function ReservationAdd() {
    return <React.Fragment>
        <h2>New reservation</h2>
        <ReservationForm reservation={null} isDisabled={false}/>
    </React.Fragment>;
};