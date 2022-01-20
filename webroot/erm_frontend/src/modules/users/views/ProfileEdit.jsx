import React from 'react';
import UserForm from '../components/UserForm';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';

const ProfileEdit = ({currentUser}) => {
    return <React.Fragment>
        <h2>Edit profile</h2>
        <UserForm user={currentUser.user} isProfile={true} isDisabled={false}/>
    </React.Fragment>;
}

ProfileEdit.propTypes = {
    currentUser: PropTypes.object,
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ProfileEdit);