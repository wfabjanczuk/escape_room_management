const putError = (key, errors, errorMessage) => {
    errors[key] = errors[key]
        ? `${errors[key]} ${errorMessage}`
        : errorMessage;
};

export function required(keys, formData, errors) {
    const errorMessage = 'This field is required.';

    for (const key of keys) {
        if ('' === formData[key]) {
            putError(key, errors, errorMessage);
        }
    }
}

export function maxLength(maxLength, keys, formData, errors) {
    const errorMessage = `Maximum length is ${maxLength}.`;

    for (const key of keys) {
        if (maxLength < formData[key].length) {
            putError(key, errors, errorMessage);
        }
    }
}

export function minMaxInt(min, max, keys, formData, errors) {
    const errorMessage = `Value of this number must be from ${min} to ${max}.`;

    for (const key of keys) {
        if (!formData[key]) {
            continue;
        }

        const number = parseInt(formData[key], 10);

        if (max < number || min > number) {
            putError(key, errors, errorMessage);
        }
    }
}

