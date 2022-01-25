import getDeletePromise from '../../app/utils/getDeletePromise';
import ROUTES from '../../app/constants/routes';

const getDeleteReviewPromise = (id, apiHeaders, addSuccessMessage, addErrorMessage) => getDeletePromise(
    ROUTES.api.review, 'Review', id, apiHeaders, addSuccessMessage, addErrorMessage
);

export default getDeleteReviewPromise;