import React, {useEffect, useState} from 'react';
import Listing from '../../app/components/listing/Listing';
import ROUTES from '../../app/constants/routes';
import axios from 'axios';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';
import getDeleteReviewPromise from '../utils/getDeleteReviewPromise';

const reviewColumns = [
    {key: 'id', name: 'Id', isExtra: false, centering: true},
    {key: 'room', name: 'Room', isExtra: false, render: (r) => r.room.name},
    {key: 'rating', name: 'Rating', isExtra: false},
    {key: 'guest', name: 'Guest', isExtra: true, render: (r) => `${r.guest.user.firstName} ${r.guest.user.lastName}`},
];

const Reviews = ({currentUser, changeCounter}) => {
    const [state, setState] = useState({
        reviews: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            axios.get(ROUTES.api.reviews, {
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
        <h2>Review list</h2>
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

Reviews.propTypes = {
    currentUser: PropTypes.object,
    changeCounter: PropTypes.number,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
    changeCounter: state.change.counter,
});

export default withAuthorization(
    connect(mapStateToProps)(Reviews),
    [ROLE_ADMIN]
);