import getDeletePromise from '../../app/utils/getDeletePromise';
import ROUTES from '../../app/constants/routes';

const getDeleteReservationPromise = (id, addSuccessMessage, addErrorMessage) => getDeletePromise(
    ROUTES.api.reservation, 'Reservation', id, addSuccessMessage, addErrorMessage
);

export default getDeleteReservationPromise;