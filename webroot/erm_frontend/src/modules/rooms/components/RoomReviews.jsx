import React, {useEffect, useState} from 'react';
import Listing from '../../app/components/listing/Listing';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import axios from 'axios';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';
import getDeleteReviewPromise from '../../reviews/utils/getDeleteReviewPromise';

const reviewColumns = [
    {key: 'id', name: 'Id', isExtra: false, centering: true},
    {key: 'guest', name: 'Guest', isExtra: false, render: (r) => `${r.guest.user.firstName} ${r.guest.user.lastName}`},
    {key: 'rating', name: 'Rating', isExtra: false},
];

const RoomReviews = ({id, currentUser, changeCounter}) => {
    const [state, setState] = useState({
        reviews: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.roomReviews, {id: id}), {
                headers: currentUser.apiHeaders,
            })
                .then(
                    (response) => setState({
                        reviews: response.data.reviews,
                        isLoading: false,
                        error: null,
                    }),
                    (error) => setState({
                        reviews: [],
                        isLoading: false,
                        error: error,
                    })
                );
        },
        [changeCounter]
    );

    return <React.Fragment>
        <h2>Room reviews</h2>
        <Listing
            error={state.error}
            isLoading={state.isLoading}
            rows={state.reviews}
            noRowsText='No reviews found.'
            columns={reviewColumns}
            actionsRoute={ROUTES.reviews}
            getDeletePromise={getDeleteReviewPromise}
            buttonText='Add new review'
            buttonUrl={ROUTES.reviews.add}
        />
    </React.Fragment>;
};

RoomReviews.propTypes = {
    id: PropTypes.number,
    currentUser: PropTypes.object,
    changeCounter: PropTypes.number,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
    changeCounter: state.change.counter,
});

export default withAuthorization(
    connect(mapStateToProps)(RoomReviews),
    [ROLE_ADMIN]
);