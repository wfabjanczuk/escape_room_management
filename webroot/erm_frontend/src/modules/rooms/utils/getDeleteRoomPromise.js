import getDeletePromise from '../../app/utils/getDeletePromise';
import ROUTES from '../../app/constants/routes';

const getDeleteRoomPromise = (id, apiHeaders, addSuccessMessage, addErrorMessage) => getDeletePromise(
    ROUTES.api.room, 'Room', id, apiHeaders, addSuccessMessage, addErrorMessage
);

export default getDeleteRoomPromise;