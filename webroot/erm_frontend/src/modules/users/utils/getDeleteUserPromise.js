import getDeletePromise from '../../app/utils/getDeletePromise';
import ROUTES from '../../app/constants/routes';

const getDeleteUserPromise = (id, apiHeaders, addSuccessMessage, addErrorMessage) => getDeletePromise(
    ROUTES.api.user, 'User', id, apiHeaders, addSuccessMessage, addErrorMessage
);

export default getDeleteUserPromise;