import getDeletePromise from '../../app/utils/getDeletePromise';
import ROUTES from '../../app/constants/routes';

const getDeleteGuestPromise = (id, addSuccessMessage, addErrorMessage) => getDeletePromise(
    ROUTES.api.guest, 'Guest', id, addSuccessMessage, addErrorMessage
);

export default getDeleteGuestPromise;