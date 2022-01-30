import React, {useEffect, useState} from 'react';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN, ROLE_GUEST} from '../../app/constants/roles';
import GuestForm from '../../guests/components/GuestForm';
import RoomForm from '../../rooms/components/RoomForm';

const ReviewDetails = ({currentUser}) => {
    const [state, setState] = useState({
            review: {},
            isLoading: true,
            error: null,
        }),
        params = useParams(),
        title = 'Review details';

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
        <ReviewForm review={state.review} isDisabled={true}/>
        {currentUser.guestId === 0 &&
            <React.Fragment>
                <h2>Review author</h2>
                <GuestForm guest={state.review.guest} isDisabled={true}/>
            </React.Fragment>
        }
        <h2>Reviewed room</h2>
        <RoomForm room={state.review.room} isDisabled={true} showFooter={currentUser.guestId === 0}/>
    </React.Fragment>;
};

ReviewDetails.propTypes = {
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default withAuthorization(
    connect(mapStateToProps)(ReviewDetails),
    [ROLE_GUEST, ROLE_ADMIN]
);