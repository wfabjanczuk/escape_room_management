import {get as _get} from 'lodash';

const isAuthorized = (user, requiredPrivileges) => {
    return Object.entries(requiredPrivileges).every(
        ([key, value]) => _get(user, `privileges[${key}]`, 0) >= value,
    );
};

export default isAuthorized;