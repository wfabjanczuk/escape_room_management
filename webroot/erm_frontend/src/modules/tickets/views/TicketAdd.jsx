import React from 'react';
import TicketForm from '../components/TicketForm';
import withAuthentication from '../../app/auth/withAuthentication';

const TicketAdd = () => {
    return <React.Fragment>
        <h2>New ticket</h2>
        <TicketForm ticket={null} isDisabled={false}/>
    </React.Fragment>;
}

export default withAuthentication(TicketAdd);