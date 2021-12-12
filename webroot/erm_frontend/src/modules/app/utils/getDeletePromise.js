import {getRouteWithParams} from '../constants/routes';
import axios from 'axios';
import {get as _get} from 'lodash';

const getDeletePromise = (apiEndpoint, entityName, id, addSuccessMessage, addErrorMessage) => {
    const url = getRouteWithParams(apiEndpoint, {id: id}),
        successMessage = `${entityName} deleted successfully.`,
        defaultErrorMessage = `${entityName} could not be deleted.`;

    return axios.delete(url)
        .then(
            (response) => addSuccessMessage(successMessage),
            (error) => {
                let errorMessage = '';

                try {
                    errorMessage = _get(JSON.parse(error.request.response), 'error.message', '');
                } catch (ignored) {
                }

                addErrorMessage(`${defaultErrorMessage} ${errorMessage}`);
                throw error;
            },
        );
};

export default getDeletePromise;