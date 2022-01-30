import React from 'react';
import Reviews from './Reviews';
import MyReviews from './MyReviews';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';

const ReviewsWrapper = ({currentUser}) => currentUser.guestId
    ? <MyReviews/>
    : <Reviews/>;

ReviewsWrapper.propTypes = {
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(ReviewsWrapper);