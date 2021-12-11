import validatorIsEmail from 'validator/lib/isEmail';
import XRegExp from "xregexp";

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
    maxLength: function (maxLength, keys) {
        const errorMessage = `Maximum length is ${maxLength}.`;

        for (const key of keys) {
            if (maxLength < formData[key].length) {
                this.putError(key, errorMessage);
            }
        }
    },
    intMinMax: function (min, max, keys) {
        const errorMessage = `Value of this number must be from ${min} to ${max}.`;

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
    isAlpha: function (keys) {
        const errorMessage = 'Only letters allowed.';

        for (const key of keys) {
            if (!XRegExp('^[\\p{Letter}]+$').test(formData[key])) {
                this.putError(key, errorMessage);
            }
        }
    },
    isDigits: function (keys) {
        const errorMessage = 'Only digits allowed.',
            pattern = /^[0-9]+$/;

        for (const key of keys) {
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
    }
});

export default NewFormValidator;
