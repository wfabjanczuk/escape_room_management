import React, {useState} from 'react';
import * as PropTypes from 'prop-types';
import NewFormValidator from '../../app/utils/FormValidator';
import Footer from '../../app/components/form/Footer';
import GuestFormFields from './GuestFormFields';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import axios from 'axios';
import {addSuccessMessage} from '../../redux/flash/flashActions';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {get as _get} from 'lodash';

const getInitialFormData = (guest) => {
    if (guest) {
        return {
            ...guest,
            discountPercent: (guest.discountPercent || 0 === guest.discountPercent) ? guest.discountPercent : '',
        };
    }

    return {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateBirth: '',
        discountPercent: '',
    };
};

const getUrls = (guest, entityExists, isDisabled) => {
    const apiUrl = entityExists
            ? getRouteWithParams(ROUTES.api.guest, {id: guest.id})
            : ROUTES.api.guests,
        cancelUrl = entityExists
            ? getRouteWithParams(ROUTES.guests.details, {id: guest.id})
            : ROUTES.guests.index,
        redirectUrl = isDisabled
            ? getRouteWithParams(ROUTES.guests.edit, {id: guest.id})
            : cancelUrl;

    return {
        api: apiUrl,
        redirect: redirectUrl,
    }
};

const validateFormData = (formData, setErrors) => {
    const formValidator = NewFormValidator(formData);

    formValidator.required(['firstName', 'lastName', 'email', 'phoneNumber', 'dateBirth']);

    formValidator.isAlpha(['firstName', 'lastName']);
    formValidator.isEmail(['email']);
    formValidator.isDigits(['phoneNumber']);
    formValidator.intMinMax(0, 20, ['discountPercent']);

    formValidator.maxLength(50, ['firstName', 'lastName']);
    formValidator.maxLength(100, ['email']);
    formValidator.maxLength(12, ['phoneNumber']);

    if (!formValidator.isValid()) {
        setErrors(formValidator.errors);
        return false;
    }

    return true;
};

const sendData = (formData, url, entityExists, setErrors, addSuccessMessage, navigate) => {
    const successMessage = `Guest ${entityExists ? 'saved' : 'created'} successfully.`;

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
                navigate(ROUTES.guests.index)
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
}

const GuestForm = ({guest, isDisabled, addSuccessMessage}) => {
    const entityExists = !!guest,
        urls = getUrls(guest, entityExists, isDisabled),
        [formData, setFormData] = useState(getInitialFormData(guest)),
        [errors, setErrors] = useState({}),
        navigate = useNavigate(),
        onValueChange = (event) => {
            setFormData(formData => ({
                ...formData,
                [event.target.name]: event.target.value,
            }))
        },
        handleSubmit = (event) => {
            event.preventDefault();
            const submittedFormData = Object.fromEntries(new FormData(event.target));

            if (validateFormData(submittedFormData, setErrors)) {
                sendData(submittedFormData, urls.api, entityExists, setErrors, addSuccessMessage, navigate);
            }
        };

    return <form className='form' method='POST' onSubmit={handleSubmit}>
        <GuestFormFields entityExists={entityExists} isDisabled={isDisabled} onValueChange={onValueChange}
                         formData={formData} errors={errors}/>
        <Footer entityExists={entityExists} isDisabled={isDisabled} redirectUrl={urls.redirect} error={errors.general}/>
    </form>;
}

GuestForm.propTypes = {
    guest: PropTypes.object,
    isDisabled: PropTypes.bool,
    addSuccessMessage: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
});

export default connect(null, mapDispatchToProps)(GuestForm);
