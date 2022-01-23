import React from 'react';
import Reservations from './Reservations';
import MyReservations from './MyReservations';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';

const ReservationsWrapper = ({guestId}) => guestId
    ? <MyReservations/>
    : <Reservations/>;

ReservationsWrapper.propTypes = {
    guestId: PropTypes.number,
};

const mapStateToProps = (state) => ({
    guestId: state.auth.guestId,
});

export default connect(mapStateToProps)(ReservationsWrapper);