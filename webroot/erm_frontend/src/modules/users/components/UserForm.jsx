import React, {useState} from 'react';
import NewFormValidator from '../../app/utils/FormValidator';
import UserFormFields from './UserFormFields';
import {addSuccessMessage} from '../../redux/flash/flashActions';
import {connect} from 'react-redux';
import {sendData} from '../../app/utils/form';
import * as PropTypes from 'prop-types';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {useNavigate} from 'react-router-dom';
import ProfileFooter from './ProfileFooter';
import EntityFormFooter from '../../app/components/form/EntityFormFooter';
import {get as _get} from 'lodash';
import getDeleteUserPromise from '../utils/getDeleteUserPromise';

const getInitialFormData = (user) => {
    if (user) {
        return {
            email: user.email,
            password: '',
            confirmPassword: '',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            dateBirth: user.dateBirth,
        };
    }

    return {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateBirth: '',
    };
};

const getUrls = (user, entityExists, isDisabled, isProfile) => {
    if (isProfile) {
        return getProfileUrls(user, entityExists, isDisabled);
    }

    const apiUrl = entityExists
            ? getRouteWithParams(ROUTES.api.user, {id: user.id})
            : ROUTES.api.users,
        cancelUrl = entityExists
            ? getRouteWithParams(ROUTES.users.details, {id: user.id})
            : ROUTES.users.index,
        editUrl = entityExists
            ? getRouteWithParams(ROUTES.users.edit, {id: user.id})
            : '',
        redirectUrl = isDisabled
            ? ROUTES.users.index
            : cancelUrl;

    return {
        api: apiUrl,
        edit: editUrl,
        redirect: redirectUrl,
    };
};

const getProfileUrls = (user, entityExists, isDisabled) => {
    const apiUrl = entityExists
            ? getRouteWithParams(ROUTES.api.user, {id: user.id})
            : ROUTES.api.signUp,
        cancelUrl = entityExists
            ? getRouteWithParams(ROUTES.users.profileDetails, {id: user.id})
            : ROUTES.users.index,
        editUrl = entityExists
            ? getRouteWithParams(ROUTES.users.profileEdit, {id: user.id})
            : '',
        redirectUrl = isDisabled
            ? ROUTES.home
            : cancelUrl;

    return {
        api: apiUrl,
        edit: editUrl,
        redirect: redirectUrl,
    };
}

const validateFormData = (formData, setErrors) => {
    const formValidator = NewFormValidator(formData);

    formValidator.required(['email', 'password', 'confirmPassword', 'firstName', 'lastName', 'phoneNumber', 'dateBirth']);

    formValidator.isAlpha(['firstName', 'lastName']);
    formValidator.isEmail(['email']);
    formValidator.isDigits(['phoneNumber'], false);

    formValidator.maxLength(['firstName', 'lastName'], 50);
    formValidator.maxLength(['email'], 320);
    formValidator.minLength(['password'], 8);
    formValidator.maxLength(['password'], 128);
    formValidator.maxLength(['phoneNumber'], 12);

    formValidator.identical(['password', 'confirmPassword'], 'password', 'Passwords must be the same!');

    if (!formValidator.isValid()) {
        setErrors(formValidator.errors);
        return false;
    }

    return true;
};

const UserForm = ({user, isDisabled, isProfile, addSuccessMessage}) => {
    const id = parseInt(_get(user, 'id', null), 10),
        entityExists = !!user,
        urls = getUrls(user, entityExists, isDisabled, isProfile),
        [formData, setFormData] = useState(getInitialFormData(user)),
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
                delete submittedFormData.confirmPassword;
                sendData(submittedFormData, urls.api, urls.redirect, entityExists, setErrors, addSuccessMessage, navigate, 'User');
            }
        };

    return <form className='form form--untitled' method='POST' onSubmit={handleSubmit}>
        <UserFormFields
            entityExists={entityExists}
            isDisabled={isDisabled}
            isProfile={isProfile}
            onValueChange={onValueChange}
            formData={formData}
            errors={errors}
        />
        {isProfile
            ? <ProfileFooter
                id={id}
                entityExists={entityExists}
                isDisabled={isDisabled}
                getDeletePromise={getDeleteUserPromise}
                editUrl={urls.edit}
                redirectUrl={urls.redirect}
                error={errors.general}
            />
            : <EntityFormFooter
                id={id}
                entityExists={entityExists}
                isDisabled={isDisabled}
                getDeletePromise={getDeleteUserPromise}
                editUrl={urls.edit}
                redirectUrl={urls.redirect}
                error={errors.general}
            />
        }

    </form>;
}

UserForm.propTypes = {
    user: PropTypes.object,
    isDisabled: PropTypes.bool,
    isProfile: PropTypes.bool,
    addSuccessMessage: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
});

export default connect(null, mapDispatchToProps)(UserForm);
