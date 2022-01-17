import React, {useState} from 'react';
import NewFormValidator from '../../app/utils/FormValidator';
import SignUpFormFields from './SignUpFormFields';
import {addSuccessMessage} from '../../redux/flash/flashActions';
import {connect} from 'react-redux';
import Footer from '../../app/components/form/Footer';

const getInitialFormData = () => ({
    email: '',
    password: '',
});

const validateFormData = (formData, setErrors) => {
    const formValidator = NewFormValidator(formData);

    formValidator.required(['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phoneNumber', 'dateBirth']);

    formValidator.isAlpha(['firstName', 'lastName']);
    formValidator.isEmail(['email']);
    formValidator.isDigits(['phoneNumber'], false);

    formValidator.maxLength(['firstName', 'lastName'], 50);
    formValidator.maxLength(['email', 'password'], 100);
    formValidator.maxLength(['phoneNumber'], 12);

    if (!formValidator.isValid()) {
        setErrors(formValidator.errors);
        return false;
    }

    return true;
};

const SignUpForm = () => {
    const [formData, setFormData] = useState(getInitialFormData()),
        [errors, setErrors] = useState({}),
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
                // empty
            }
        };

    return <form className='form form--untitled' method='POST' onSubmit={handleSubmit}>
        <SignUpFormFields onValueChange={onValueChange} formData={formData} errors={errors}/>
        <Footer submitText='Create guest account' submitWide={true} error={errors.general}/>
    </form>;
}

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
});

export default connect(null, mapDispatchToProps)(SignUpForm);
