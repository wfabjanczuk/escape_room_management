import getDeletePromise from '../../app/utils/getDeletePromise';
import ROUTES from '../../app/constants/routes';

const getDeleteTicketPromise = (id, addSuccessMessage, addErrorMessage) => getDeletePromise(
    ROUTES.api.ticket, 'Ticket', id, addSuccessMessage, addErrorMessage
);

export default getDeleteTicketPromise;