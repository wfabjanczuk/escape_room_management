import validatorIsEmail from 'validator/lib/isEmail';
import XRegExp from "xregexp";

const putError = (key, errors, errorMessage) => {
    errors[key] = errors[key] ? errors[key] : errorMessage;
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

export function intMinMax(min, max, keys, formData, errors) {
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

export function isAlpha(keys, formData, errors) {
    const errorMessage = 'Only letters allowed.';

    for (const key of keys) {
        if (!XRegExp('^[\\p{Letter}]+$').test(formData[key])) {
            putError(key, errors, errorMessage);
        }
    }
}

export function isDigits(keys, formData, errors) {
    const errorMessage = 'Only digits allowed.',
        pattern = /^[0-9]+$/;

    for (const key of keys) {
        if (!pattern.test(formData[key])) {
            putError(key, errors, errorMessage);
        }
    }
}

export function isEmail(keys, formData, errors) {
    const errorMessage = 'This field must be a valid email address.';

    for (const key of keys) {
        if (!validatorIsEmail(formData[key])) {
            putError(key, errors, errorMessage);
        }
    }
}