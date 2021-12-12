import React, {useEffect, useState} from 'react';
import Listing from '../../app/components/listing/Listing';
import ROUTES from '../../app/constants/routes';
import axios from 'axios';
import getDeleteGuestPromise from '../utils/getDeleteGuestPromise';

const guestColumns = [
    {key: 'id', name: 'Id', isExtra: false, centering: true},
    {key: 'firstName', name: 'First name', isExtra: false},
    {key: 'lastName', name: 'Last name', isExtra: false},
    {key: 'email', name: 'Email', isExtra: true},
];

export default function Guests() {
    const [state, setState] = useState({
        guests: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            axios.get(ROUTES.api.guests)
                .then(
                    (response) => setState({
                        guests: response.data.guests,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        guests: [],
                        isLoading: false,
                        error: error,
                    })
                );
        },
        []
    );

    return <React.Fragment>
        <h2>Guest list</h2>
        <Listing
            error={state.error}
            isLoading={state.isLoading}
            rows={state.guests}
            noRowsText='No guests found.'
            columns={guestColumns}
            actionsRoute={ROUTES.guests}
            getDeletePromise={getDeleteGuestPromise}
            buttonText='Register new guest'
            buttonUrl={ROUTES.guests.add}
        />
    </React.Fragment>;
};