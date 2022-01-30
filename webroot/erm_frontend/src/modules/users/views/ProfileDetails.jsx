import React from 'react';
import UserForm from '../components/UserForm';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import withAuthentication from '../../app/auth/withAuthentication';

const ProfileDetails = ({currentUser}) => {
    return <React.Fragment>
        <h2>Profile details</h2>
        <UserForm user={currentUser.profile} isProfile={true} isDisabled={true}/>
    </React.Fragment>;
}

ProfileDetails.propTypes = {
    currentUser: PropTypes.object,
}

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default withAuthentication(connect(mapStateToProps)(ProfileDetails));