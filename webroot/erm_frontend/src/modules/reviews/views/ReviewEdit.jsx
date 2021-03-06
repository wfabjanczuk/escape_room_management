import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN, ROLE_GUEST} from '../../app/constants/roles';

const ReviewEdit = ({currentUser}) => {
    const [state, setState] = useState({
            review: {},
            isLoading: true,
            error: null,
        }),
        params = useParams(),
        title = 'Edit review';

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.review, {id: params.id}), {
                headers: currentUser.apiHeaders,
            })
                .then(
                    (response) => setState({
                        review: response.data.review,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        review: {},
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
        <ReviewForm review={state.review} isDisabled={false}/>
    </React.Fragment>;
}

ReviewEdit.propTypes = {
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default withAuthorization(
    connect(mapStateToProps)(ReviewEdit),
    [ROLE_GUEST, ROLE_ADMIN]
);