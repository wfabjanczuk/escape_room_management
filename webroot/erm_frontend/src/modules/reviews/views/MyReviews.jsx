import React, {useEffect, useState} from 'react';
import Listing from '../../app/components/listing/Listing';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import axios from 'axios';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_GUEST} from '../../app/constants/roles';
import {addErrorMessage, addSuccessMessage} from '../../app/redux/flash/flashActions';
import {increaseChangeCounter} from '../../app/redux/change/changeActions';
import getDeleteReviewPromise from '../utils/getDeleteReviewPromise';

const reviewColumns = [
    {key: 'id', name: 'Id', isExtra: false, centering: true},
    {key: 'room', name: 'Room', isExtra: false, render: (r) => r.room.name},
    {key: 'rating', name: 'Rating', isExtra: false},
    {key: 'reply', name: 'Reply', isExtra: true, render: (r) => r.reply ? 'Yes' : 'No'},
];

const MyReviews = ({changeCounter, guestId, apiHeaders}) => {
    const [state, setState] = useState({
        reviews: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
            axios.get(getRouteWithParams(ROUTES.api.guestReviews, {id: guestId}), {
                headers: apiHeaders,
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
            noRowsText='You have no reviews.'
            columns={reviewColumns}
            actionsRoute={ROUTES.reviews}
            getDeletePromise={getDeleteReviewPromise}
            isGuestAuthorized={true}
            buttonText='Add new review'
            buttonUrl={ROUTES.reviews.add}
        />
    </React.Fragment>;
};

MyReviews.propTypes = {
    changeCounter: PropTypes.number,
    guestId: PropTypes.number,
    apiHeaders: PropTypes.object,
};

const mapStateToProps = (state) => ({
    changeCounter: state.change.counter,
    guestId: state.auth.guestId,
    apiHeaders: state.auth.apiHeaders,
});

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
    addErrorMessage: (content) => dispatch(addErrorMessage(content)),
    increaseChangeCounter: () => dispatch(increaseChangeCounter()),
});

export default withAuthorization(
    connect(mapStateToProps, mapDispatchToProps)(MyReviews),
    [ROLE_GUEST]
);