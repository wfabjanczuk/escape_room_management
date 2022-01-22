import getDeletePromise from '../../app/utils/getDeletePromise';
import ROUTES from '../../app/constants/routes';

const getDeleteReservationPromise = (id, apiHeaders, addSuccessMessage, addErrorMessage) => getDeletePromise(
    ROUTES.api.reservation, 'Reservation', id, apiHeaders, addSuccessMessage, addErrorMessage
);

export default getDeleteReservationPromise;