import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import ReservationForm from '../components/ReservationForm';

export default function ReservationEdit() {
    const [state, setState] = useState({
            reservation: {},
            isLoading: true,
            error: null,
        }),
        params = useParams(),
        title = 'Edit reservation';

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.reservation, {id: params.id}))
                .then(
                    (response) => setState({
                        reservation: response.data.reservation,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        reservation: {},
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
        <ReservationForm reservation={state.reservation} isDisabled={false}/>
    </React.Fragment>;
}