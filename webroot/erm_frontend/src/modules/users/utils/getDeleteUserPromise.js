import getDeletePromise from '../../app/utils/getDeletePromise';
import ROUTES from '../../app/constants/routes';

const getDeleteUserPromise = (id, addSuccessMessage, addErrorMessage) => getDeletePromise(
    ROUTES.api.user, 'User', id, addSuccessMessage, addErrorMessage
);

export default getDeleteUserPromise;