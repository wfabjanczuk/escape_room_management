import axios from 'axios';
import {get as _get} from 'lodash';

export const sendData = (formData, url, redirectUrl, entityExists, setErrors, addSuccessMessage, navigate, entityName) => {
    const successMessage = `${entityName} ${entityExists ? 'saved' : 'created'} successfully.`;

    axios(url, {
        method: entityExists ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: formData
    })
        .then(
            (response) => {
                setErrors({});
                addSuccessMessage(successMessage);
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