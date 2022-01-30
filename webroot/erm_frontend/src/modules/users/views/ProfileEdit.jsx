import React from 'react';
import UserForm from '../components/UserForm';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import withAuthentication from '../../app/auth/withAuthentication';

const ProfileEdit = ({currentUser}) => {
    return <React.Fragment>
        <h2>Edit profile</h2>
        <UserForm user={currentUser.profile} isProfile={true} isDisabled={false}/>
    </React.Fragment>;
}

ProfileEdit.propTypes = {
    currentUser: PropTypes.object,
}

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default withAuthentication(connect(mapStateToProps)(ProfileEdit));