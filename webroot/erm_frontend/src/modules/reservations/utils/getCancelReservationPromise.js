import axios from 'axios';
import {get as _get} from 'lodash';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';

const getCancelReservationPromise = (id, apiHeaders, addSuccessMessage, addErrorMessage) => {
    const url = getRouteWithParams(ROUTES.api.cancelReservation, {id: id}),
        successMessage = 'Reservation cancelled successfully.',
        defaultErrorMessage = 'Reservation could not be cancelled.';

    return axios(url, {
        method: 'PATCH',
        headers: apiHeaders,
    })
        .then(
            () => addSuccessMessage(successMessage),
            (error) => {
                let errorMessage = '';

                try {
                    errorMessage = _get(JSON.parse(error.request.response), 'error.message', '');
                } catch (ignored) {
                    // continue regardless of error
                }

                addErrorMessage(`${defaultErrorMessage} ${errorMessage}`);
                throw error;
            },
        );
};

export default getCancelReservationPromise;