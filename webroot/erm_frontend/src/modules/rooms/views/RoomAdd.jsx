import React from 'react';
import RoomForm from '../components/RoomForm';
import withAuthentication from '../../app/auth/withAuthentication';

const RoomAdd = () => {
    return <React.Fragment>
        <h2>New room</h2>
        <RoomForm room={null} isDisabled={false}/>
    </React.Fragment>;
}

export default withAuthentication(RoomAdd);