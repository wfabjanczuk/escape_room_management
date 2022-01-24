import React, {useState} from 'react';
import NewFormValidator from '../../app/utils/FormValidator';
import UserFormFields from './UserFormFields';
import {addSuccessMessage} from '../../app/redux/flash/flashActions';
import {connect} from 'react-redux';
import {sendData} from '../../app/utils/form';
import * as PropTypes from 'prop-types';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {Link, useNavigate} from 'react-router-dom';
import ProfileFooter from './ProfileFooter';
import EntityFormFooter from '../../app/components/form/EntityFormFooter';
import {get as _get} from 'lodash';
import getDeleteUserPromise from '../utils/getDeleteUserPromise';
import {ROLE_SELECT_OPTIONS} from '../../app/constants/roles';
import {setCurrentUser} from '../../app/redux/auth/authActions';

const getInitialFormData = (user) => {
    if (user) {
        return {
            id: user.id,
            email: user.email,
            password: '',
            confirmPassword: '',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            dateBirth: user.dateBirth,
            isActive: !!user.isActive,
            roleId: user.roleId,
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
        isActive: false,
        roleId: '',
    };
};

const getUrls = (user, entityExists, isDisabled, isProfile) => {
    if (isProfile) {
        return getProfileUrls(user, entityExists);
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

const getProfileUrls = (user, entityExists) => {
    const apiUrl = entityExists
            ? getRouteWithParams(ROUTES.api.user, {id: user.id})
            : ROUTES.api.signUp,
        editUrl = entityExists
            ? getRouteWithParams(ROUTES.users.profileEdit, {id: user.id})
            : '',
        redirectUrl = entityExists
            ? getRouteWithParams(ROUTES.users.profileDetails, {id: user.id})
            : ROUTES.users.signIn;

    return {
        api: apiUrl,
        edit: editUrl,
        redirect: redirectUrl,
    };
}

const validateFormData = (entityExists, isProfile, formData, setErrors) => {
    const formValidator = NewFormValidator(formData);

    formValidator.required(['email', 'firstName', 'lastName', 'phoneNumber', 'dateBirth']);

    if (!entityExists) {
        formValidator.required(['password']);
    }

    if (!entityExists && isProfile) {
        formValidator.required(['confirmPassword']);
    }

    if (isProfile) {
        formValidator.identical(['password', 'confirmPassword'], 'password', 'Passwords must be the same!');
    } else {
        formValidator.required(['roleId']);
    }

    formValidator.isAlpha(['firstName', 'lastName']);
    formValidator.isEmail(['email']);
    formValidator.isDigits(['phoneNumber'], false);

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

const UserForm = (
    {
        user,
        isDisabled,
        isProfile,
        userGuestId = 0,
        apiHeaders,
        currentUser,
        setCurrentUser,
        addSuccessMessage,
        guestId,
        jwt
    }
) => {
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

            if (validateFormData(entityExists, isProfile, submittedFormData, setErrors)) {
                delete submittedFormData.confirmPassword;
                let callback = null;

                if (entityExists && isProfile) {
                    callback = () => setCurrentUser({
                        user: {
                            ...currentUser,
                            ...submittedFormData,
                        },
                        guestId: guestId,
                        jwt: jwt,
                    });
                }

                sendData(submittedFormData, urls.api, urls.redirect, entityExists, apiHeaders, setErrors, addSuccessMessage, navigate, 'User', callback);
            }
        },
        extraButton = (userGuestId > 0 && isDisabled)
            ? <Link
                className='button button--primary hoverable'
                to={getRouteWithParams(ROUTES.guests.details, {id: userGuestId})}>
                Guest details
            </Link>
            : null;

    return <form className='form form--untitled' method='POST' onSubmit={handleSubmit}>
        <UserFormFields
            entityExists={entityExists}
            roleOptions={ROLE_SELECT_OPTIONS}
            isDisabled={isDisabled}
            isProfile={isProfile}
            onValueChange={onValueChange}
            formData={formData}
            errors={errors}
        />
        {isProfile
            ? <ProfileFooter
                entityExists={entityExists}
                isDisabled={isDisabled}
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
                extraButtons={extraButton}
            />
        }
    </form>;
}

UserForm.propTypes = {
    user: PropTypes.object,
    isDisabled: PropTypes.bool,
    isProfile: PropTypes.bool,
    userGuestId: PropTypes.number,
    apiHeaders: PropTypes.object,
    currentUser: PropTypes.object,
    addSuccessMessage: PropTypes.func,
    setCurrentUser: PropTypes.func,
    guestId: PropTypes.number,
    jwt: PropTypes.string,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
    jwt: state.auth.jwt,
    guestId: state.auth.guestId,
    apiHeaders: state.auth.apiHeaders,
});

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
    setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
