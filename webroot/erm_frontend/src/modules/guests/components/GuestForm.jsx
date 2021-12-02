import React, {useState} from 'react';
import * as PropTypes from 'prop-types';
import {maxLength, minMaxInt, required} from '../../app/utils/formValidators';
import Footer from '../../app/components/form/Footer';
import GuestFormFields from './GuestFormFields';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';

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
    const cancelUrl = entityExists
            ? getRouteWithParams(ROUTES.guests.details, {id: guest.id})
            : ROUTES.guests.index,
        redirectUrl = isDisabled
            ? getRouteWithParams(ROUTES.guests.edit, {id: guest.id})
            : cancelUrl;

    return {
        redirect: redirectUrl,
    }
};

const validateFormData = (formData, setErrors) => {
    const errors = {};

    required(['firstName', 'lastName', 'email', 'phoneNumber', 'dateBirth'], formData, errors);

    maxLength(50, ['firstName', 'lastName'], formData, errors);
    maxLength(100, ['email'], formData, errors);
    maxLength(12, ['phoneNumber'], formData, errors);

    minMaxInt(0, 20, ['discountPercent'], formData, errors);

    setErrors(errors);

    return 0 === Object.keys(errors).length;
};

const GuestForm = ({guest, isDisabled}) => {
    const entityExists = !!guest,
        urls = getUrls(guest, entityExists, isDisabled),
        [formData, setFormData] = useState(getInitialFormData(guest)),
        [errors, setErrors] = useState({}),
        onValueChange = (event) => {
            setFormData(formData => ({
                ...formData,
                [event.target.name]: event.target.value,
            }))
        },
        handleSubmit = (event) => {
            event.preventDefault();

            validateFormData(formData, setErrors);
        };

    return <form className='form' method='POST' onSubmit={handleSubmit}>
        <GuestFormFields entityExists={entityExists} isDisabled={isDisabled} onValueChange={onValueChange}
                         formData={formData} errors={errors}/>
        <Footer entityExists={entityExists} isDisabled={isDisabled} redirectUrl={urls.redirect}/>
    </form>;
}

GuestForm.propTypes = {
    guest: PropTypes.object,
    isDisabled: PropTypes.bool,
};

export default GuestForm;