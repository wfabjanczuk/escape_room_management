import {get as _get} from 'lodash';

const isAuthorized = (user, allowedRoles) => {
    return allowedRoles.includes(_get(user, 'roleId', 0));
};

export default isAuthorized;