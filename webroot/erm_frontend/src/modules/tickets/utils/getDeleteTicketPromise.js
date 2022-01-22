import getDeletePromise from '../../app/utils/getDeletePromise';
import ROUTES from '../../app/constants/routes';

const getDeleteTicketPromise = (id, apiHeaders, addSuccessMessage, addErrorMessage) => getDeletePromise(
    ROUTES.api.ticket, 'Ticket', id, apiHeaders, addSuccessMessage, addErrorMessage
);

export default getDeleteTicketPromise;