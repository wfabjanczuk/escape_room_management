import React, {useEffect, useState} from 'react';
import ROUTES from '../../app/constants/routes';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import GuestForm from '../components/GuestForm';

export default function GuestEdit() {
    const [state, setState] = useState({
            guest: {},
            isLoading: true,
            error: null,
        }),
        params = useParams(),
        title = 'Edit guest';

    useEffect(() => {
            axios(`${ROUTES.api.guests}/${params.guestId}`)
                .then(
                    (response) => setState({
                        guest: response.data.guest,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        guest: {},
                        isLoading: false,
                        error: error,
                    })
                )
        },
        [params]
    );

    if (state.error) {
        return <React.Fragment>
            <h2>{title}</h2>
            <p>{state.error.message}</p>
        </React.Fragment>;
    }

    if (state.isLoading) {
        return <React.Fragment>
            <h2>{title}</h2>
            <p>Loading...</p>
        </React.Fragment>;
    }

    return <React.Fragment>
        <h2>{title}</h2>
        <GuestForm guest={state.guest}/>
    </React.Fragment>;
};