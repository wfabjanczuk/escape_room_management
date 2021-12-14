import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import TicketForm from '../components/TicketForm';

export default function TicketDetails() {
    const [state, setState] = useState({
            ticket: {},
            isLoading: true,
            error: null,
        }),
        params = useParams(),
        title = 'Ticket details';

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.ticket, {id: params.id}))
                .then(
                    (response) => setState({
                        ticket: response.data.ticket,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        ticket: {},
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
        <TicketForm ticket={state.ticket} isDisabled={true}/>
    </React.Fragment>;
};