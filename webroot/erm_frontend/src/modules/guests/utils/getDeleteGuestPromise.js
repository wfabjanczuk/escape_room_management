import getDeletePromise from '../../app/utils/getDeletePromise';
import ROUTES from '../../app/constants/routes';

const getDeleteGuestPromise = (id, apiHeaders, addSuccessMessage, addErrorMessage) => getDeletePromise(
    ROUTES.api.guest, 'Guest', id, apiHeaders, addSuccessMessage, addErrorMessage
);

export default getDeleteGuestPromise;