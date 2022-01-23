import React from 'react';
import TicketForm from '../components/TicketForm';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const TicketAdd = () => {
    return <React.Fragment>
        <h2>New ticket</h2>
        <TicketForm ticket={null} isDisabled={false}/>
    </React.Fragment>;
}

export default withAuthorization(
    TicketAdd,
    [ROLE_ADMIN]
);