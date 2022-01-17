import React from 'react';
import TicketForm from '../components/TicketForm';

export default function TicketAdd() {
    return <React.Fragment>
        <h2>New ticket</h2>
        <TicketForm ticket={null} isDisabled={false}/>
    </React.Fragment>;
}