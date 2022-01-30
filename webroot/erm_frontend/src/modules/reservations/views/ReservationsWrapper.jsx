import React from 'react';
import Reservations from './Reservations';
import MyReservations from './MyReservations';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';

const ReservationsWrapper = ({currentUser}) => currentUser.guestId
    ? <MyReservations/>
    : <Reservations/>;

ReservationsWrapper.propTypes = {
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(ReservationsWrapper);