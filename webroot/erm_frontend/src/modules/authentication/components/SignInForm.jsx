import React, {useState} from 'react';
import NewFormValidator from '../../app/utils/FormValidator';
import SignInFormFields from './SignInFormFields';
import {addSuccessMessage} from '../../redux/flash/flashActions';
import {connect} from 'react-redux';
import Footer from '../../app/components/form/Footer';

const getInitialFormData = () => ({
    email: '',
    password: '',
});

const validateFormData = (formData, setErrors) => {
    const formValidator = NewFormValidator(formData);

    formValidator.required(['email', 'password']);
    formValidator.isEmail(['email']);
    formValidator.maxLength(['email', 'password'], 100);

    if (!formValidator.isValid()) {
        setErrors(formValidator.errors);
        return false;
    }

    return true;
};

const SignInForm = () => {
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
        <SignInFormFields onValueChange={onValueChange} formData={formData} errors={errors}/>
        <Footer submitText='Sign in' submitWide={false} error={errors.general}/>
    </form>;
}

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
});

export default connect(null, mapDispatchToProps)(SignInForm);
