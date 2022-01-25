import React from 'react';
import Reviews from './Reviews';
import MyReviews from './MyReviews';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';

const ReviewsWrapper = ({guestId}) => guestId
    ? <MyReviews/>
    : <Reviews/>;

ReviewsWrapper.propTypes = {
    guestId: PropTypes.number,
};

const mapStateToProps = (state) => ({
    guestId: state.auth.guestId,
});

export default connect(mapStateToProps)(ReviewsWrapper);