import React from 'react';
import RoomForm from '../components/RoomForm';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const RoomAdd = () => {
    return <React.Fragment>
        <h2>New room</h2>
        <RoomForm room={null} isDisabled={false}/>
    </React.Fragment>;
}

export default withAuthorization(
    RoomAdd,
    [ROLE_ADMIN]
);