import React from 'react';
import ReviewForm from '../components/ReviewForm';
import withAuthorization from '../../app/auth/withAuthorization';
import {ROLE_ADMIN} from '../../app/constants/roles';

const ReviewAdd = () => {
    return <React.Fragment>
        <h2>New review</h2>
        <ReviewForm review={null} isDisabled={false}/>
    </React.Fragment>;
}

export default withAuthorization(
    ReviewAdd,
    [ROLE_ADMIN]
);