import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import TicketForm from '../components/TicketForm';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const TicketEdit = ({currentUser}) => {
    const [state, setState] = useState({
            ticket: {},
            isLoading: true,
            error: null,
        }),
        params = useParams(),
        title = 'Edit ticket';

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.ticket, {id: params.id}), {
                headers: currentUser.apiHeaders,
            })
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
        <TicketForm ticket={state.ticket} isDisabled={false}/>
    </React.Fragment>;
}

TicketEdit.propTypes = {
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default withAuthorization(
    connect(mapStateToProps)(TicketEdit),
    [ROLE_ADMIN]
);