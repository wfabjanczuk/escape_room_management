import React, {useEffect, useState} from 'react';
import Listing from '../../app/components/listing/Listing';
import ROUTES from '../../app/constants/routes';
import axios from "axios";

const guestColumns = [
    {key: 'first_name', name: 'First name', isExtra: false},
    {key: 'last_name', name: 'Last name', isExtra: false},
    {key: 'email', name: 'Email', isExtra: true},
];

export default function Guests() {
    const [state, setState] = useState({
        guests: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            axios(ROUTES.api.guests)
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
                )
        },
        []
    );

    return <Listing
        error={state.error}
        isLoading={state.isLoading}
        title={'Guest list'}
        rows={state.guests}
        columns={guestColumns}
        actionsRoute={ROUTES.site.guests}
    />;
};