import React from 'react';
import UserForm from '../components/UserForm';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';

const ProfileDetails = ({currentUser}) => {
    return <React.Fragment>
        <h2>Profile details</h2>
        <UserForm user={currentUser.user} isProfile={true} isDisabled={true}/>
    </React.Fragment>;
}

ProfileDetails.propTypes = {
    currentUser: PropTypes.object,
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ProfileDetails);