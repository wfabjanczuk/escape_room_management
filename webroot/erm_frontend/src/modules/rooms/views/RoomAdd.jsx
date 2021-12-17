import React from 'react';
import RoomForm from '../components/RoomForm';

export default function RoomAdd() {
    return <React.Fragment>
        <h2>New room</h2>
        <RoomForm room={null} isDisabled={false}/>
    </React.Fragment>;
};