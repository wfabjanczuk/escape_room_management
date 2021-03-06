import validatorIsEmail from 'validator/lib/isEmail';
import XRegExp from 'xregexp';
import {API_DATE_FORMAT} from '../constants/dates';
import moment from 'moment';

const NewFormValidator = (formData) => ({
    formData: formData,
    errors: {},
    isValid: function () {
        return 0 === Object.keys(this.errors).length;
    },
    putError: function (key, errorMessage) {
        this.errors[key] = this.errors[key] ? this.errors[key] : errorMessage;
    },
    required: function (keys) {
        const errorMessage = 'This field is required.';

        for (const key of keys) {
            if ('' === formData[key]) {
                this.putError(key, errorMessage);
            }
        }
    },
    minLength: function (keys, minLength, nullable = true) {
        const errorMessage = `Minimum length is ${minLength}.`;

        for (const key of keys) {
            if (nullable && formData[key] === '') {
                continue;
            }

            if (formData[key].length < minLength) {
                this.putError(key, errorMessage);
            }
        }
    },
    maxLength: function (keys, maxLength) {
        const errorMessage = `Maximum length is ${maxLength}.`;

        for (const key of keys) {
            if (maxLength < formData[key].length) {
                this.putError(key, errorMessage);
            }
        }
    },
    intPositive: function (keys) {
        const errorMessage = 'This number must be greater than zero.';

        for (const key of keys) {
            if (!formData[key]) {
                continue;
            }

            const number = parseInt(formData[key], 10);

            if (number <= 0) {
                this.putError(key, errorMessage);
            }
        }
    },
    intMinMax: function (keys, min, max) {
        const errorMessage = `This number must be from ${min} to ${max}.`;

        for (const key of keys) {
            if (!formData[key]) {
                continue;
            }

            const number = parseInt(formData[key], 10);

            if (max < number || min > number) {
                this.putError(key, errorMessage);
            }
        }
    },
    identical: function (keys, mainKey, errorMessage) {
        const mainValue = formData[mainKey];

        for (const key of keys) {
            if (formData[key] !== mainValue) {
                this.putError(key, errorMessage);
            }
        }
    },
    isAlpha: function (keys) {
        const errorMessage = 'Only letters allowed.';

        for (const key of keys) {
            if (!XRegExp('^[\\p{Letter}]+$').test(formData[key])) {
                this.putError(key, errorMessage);
            }
        }
    },
    isDigits: function (keys, nullable = true) {
        const errorMessage = 'Only digits allowed.',
            pattern = /^[0-9]+$/;

        for (const key of keys) {
            if (nullable && formData[key] === '') {
                continue;
            }

            if (!pattern.test(formData[key])) {
                this.putError(key, errorMessage);
            }
        }
    },
    isEmail: function (keys) {
        const errorMessage = 'This field must be a valid email address.';

        for (const key of keys) {
            if (!validatorIsEmail(formData[key])) {
                this.putError(key, errorMessage);
            }
        }
    },
    isMoney: function (keys, nullable = true) {
        const isMoneyErrorMessage = 'Only positive numbers with 2 decimal points allowed.',
            isNonZeroErrorMessage = 'This number must be greater than zero.',
            validPattern = /^[0-9]+\.[0-9]{2}$/,
            zeroPattern = /^[0]+\.[0]+$/;

        for (const key of keys) {
            if (!validPattern.test(formData[key])) {
                this.putError(key, isMoneyErrorMessage);
            }

            if (!nullable && zeroPattern.test(formData[key])) {
                this.putError(key, isNonZeroErrorMessage);
            }
        }
    },
    isDate: function (keys, nullable = true) {
        const errorMessage = 'This field must be a valid date.';

        for (const key of keys) {
            if (nullable && formData[key] === '') {
                continue;
            }

            const dateTime = moment(formData[key], API_DATE_FORMAT);
            if (!dateTime.isValid()) {
                this.putError(key, errorMessage);
            }
        }
    },
});

export default NewFormValidator;
