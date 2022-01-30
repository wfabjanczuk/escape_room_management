import {get as _get} from 'lodash';

const isAuthorized = (currentUser, allowedRoles) => {
    return currentUser.profile && allowedRoles.includes(_get(currentUser.profile, 'roleId', 0));
};

export default isAuthorized;