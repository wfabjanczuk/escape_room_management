import axios from 'axios';
import {get as _get} from 'lodash';

export const sendData = (formData, url, redirectUrl, entityExists, apiHeaders, setErrors, addSuccessMessage, navigate, entityName, callback = null) => {
    const successMessage = `${entityName} ${entityExists ? 'saved' : 'created'} successfully.`;

    axios(url, {
        method: entityExists ? 'PUT' : 'POST',
        headers: apiHeaders,
        data: formData
    })
        .then(
            () => {
                setErrors({});
                addSuccessMessage(successMessage);
                callback && callback();

                navigate(redirectUrl);
            },
            (error) => {
                const errorResponse = JSON.parse(error.request.response),
                    errors = _get(errorResponse, 'error', {general: ['API error. Please try again later.']}),
                    errorsToDisplay = {};

                for (const key in errors) {
                    if (0 < errors[key].length) {
                        errorsToDisplay[key] = errors[key][0];
                    }
                }

                setErrors(errorsToDisplay);
            },
        );
};