import React from 'react';
import GuestForm from '../components/GuestForm';

export default function GuestAdd() {
    return <React.Fragment>
        <h2>New guest</h2>
        <GuestForm guest={null} isDisabled={false}/>
    </React.Fragment>;
};