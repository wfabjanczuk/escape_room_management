import getDeletePromise from '../../app/utils/getDeletePromise';
import ROUTES from '../../app/constants/routes';

const getDeleteRoomPromise = (id, addSuccessMessage, addErrorMessage) => getDeletePromise(
    ROUTES.api.room, 'Room', id, addSuccessMessage, addErrorMessage
);

export default getDeleteRoomPromise;