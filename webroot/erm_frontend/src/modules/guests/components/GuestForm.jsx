import React, {useState} from 'react';
import * as PropTypes from 'prop-types';
import NewFormValidator from '../../app/utils/FormValidator';
import Footer from '../../app/components/form/EntityFormFooter';
import GuestFormFields from './GuestFormFields';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {addSuccessMessage} from '../../app/redux/flash/flashActions';
import {connect} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {get as _get} from 'lodash';
import getDeleteGuestPromise from '../utils/getDeleteGuestPromise';
import {sendData} from '../../app/utils/form';

const getInitialFormData = (guest) => {
    if (guest) {
        return {
            id: guest.id,
            firstName: guest.user.firstName,
            lastName: guest.user.lastName,
            email: guest.user.email,
            phoneNumber: guest.user.phoneNumber,
            dateBirth: guest.user.dateBirth,
            discountPercent: (guest.discountPercent || 0 === guest.discountPercent) ? guest.discountPercent : '',
            password: '',
            isActive: !!guest.user.isActive,
        };
    }

    return {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateBirth: '',
        discountPercent: '',
        password: '',
        isActive: false,
    };
};

const getUrls = (guest, entityExists, isDisabled) => {
    const apiUrl = entityExists
            ? getRouteWithParams(ROUTES.api.guest, {id: guest.id})
            : ROUTES.api.guests,
        cancelUrl = entityExists
            ? getRouteWithParams(ROUTES.guests.details, {id: guest.id})
            : ROUTES.guests.index,
        editUrl = entityExists
            ? getRouteWithParams(ROUTES.guests.edit, {id: guest.id})
            : '',
        redirectUrl = isDisabled
            ? ROUTES.guests.index
            : cancelUrl;

    return {
        api: apiUrl,
        edit: editUrl,
        redirect: redirectUrl,
    }
};

const validateFormData = (formData, setErrors) => {
    const formValidator = NewFormValidator(formData);

    formValidator.required(['firstName', 'lastName', 'email', 'phoneNumber', 'dateBirth']);

    formValidator.isAlpha(['firstName', 'lastName']);
    formValidator.isEmail(['email']);
    formValidator.isDigits(['phoneNumber'], false);
    formValidator.intMinMax(['discountPercent'], 0, 20);

    formValidator.maxLength(['firstName', 'lastName'], 50);
    formValidator.maxLength(['email'], 320);
    formValidator.minLength(['password'], 8);
    formValidator.maxLength(['password'], 128);
    formValidator.maxLength(['phoneNumber'], 12);

    if (!formValidator.isValid()) {
        setErrors(formValidator.errors);
        return false;
    }

    return true;
};

const GuestForm = ({guest, isDisabled, apiHeaders, addSuccessMessage}) => {
    const id = parseInt(_get(guest, 'id', null), 10),
        entityExists = !!guest,
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
                sendData(submittedFormData, urls.api, urls.redirect, entityExists, apiHeaders, setErrors, addSuccessMessage, navigate, 'Guest');
            }
        },
        extraButton = (id > 0 && isDisabled)
            ? <Link
                className='button button--primary hoverable'
                to={getRouteWithParams(ROUTES.users.details, {id: id})}>
                User details
            </Link>
            : null;

    return <form className='form' method='POST' onSubmit={handleSubmit}>
        <GuestFormFields
            entityExists={entityExists}
            isDisabled={isDisabled}
            onValueChange={onValueChange}
            formData={formData}
            errors={errors}
        />
        <Footer
            id={id}
            entityExists={entityExists}
            isDisabled={isDisabled}
            getDeletePromise={getDeleteGuestPromise}
            editUrl={urls.edit}
            redirectUrl={urls.redirect}
            error={errors.general}
            extraButtons={extraButton}
        />
    </form>;
}

GuestForm.propTypes = {
    guest: PropTypes.object,
    isDisabled: PropTypes.bool,
    apiHeaders: PropTypes.object,
    addSuccessMessage: PropTypes.func,
};

const mapStateToProps = (state) => ({
    apiHeaders: state.auth.apiHeaders,
});

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GuestForm);
