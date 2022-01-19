import React, {useState} from 'react';
import NewFormValidator from '../../app/utils/FormValidator';
import UserFormFields from './UserFormFields';
import {addSuccessMessage} from '../../redux/flash/flashActions';
import {connect} from 'react-redux';
import Footer from '../../app/components/form/Footer';
import {sendData} from '../../app/utils/form';
import * as PropTypes from 'prop-types';
import ROUTES from '../../app/constants/routes';
import {useNavigate} from 'react-router-dom';

// const getInitialFormData = () => ({
//     email: '',
//     password: '',
//     confirmPassword: '',
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     dateBirth: '',
// });

const getInitialFormData = () => ({
    email: 'first@last.com',
    password: 'password',
    confirmPassword: 'password',
    firstName: 'First',
    lastName: 'Last',
    phoneNumber: '100200300',
    dateBirth: '2022-01-18',
});

const getUrls = (user, entityExists, isDisabled, isProfile) => {
    console.log(isProfile);

    // const apiUrl = entityExists
    //         ? getRouteWithParams(ROUTES.api.user, {id: user.id})
    //         : ROUTES.api.signUp,
    //     cancelUrl = entityExists
    //         ? getRouteWithParams(ROUTES.users.details, {id: user.id})
    //         : ROUTES.users.index,
    //     editUrl = entityExists
    //         ? getRouteWithParams(ROUTES.users.edit, {id: user.id})
    //         : '',
    //     redirectUrl = isDisabled
    //         ? ROUTES.users.index
    //         : cancelUrl;

    return {
        api: ROUTES.api.signUp,
        edit: '',
        redirect: ROUTES.home,
    }
};

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
    const entityExists = !!user,
        urls = getUrls(user, entityExists, isDisabled, isProfile),
        [formData, setFormData] = useState(getInitialFormData()),
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
        <UserFormFields onValueChange={onValueChange} formData={formData} errors={errors}/>
        <Footer submitText='Create guest account' submitWide={true} error={errors.general}/>
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
