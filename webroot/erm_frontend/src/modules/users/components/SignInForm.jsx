import React, {useState} from 'react';
import NewFormValidator from '../../app/utils/FormValidator';
import SignInFormFields from './SignInFormFields';
import {addSuccessMessage} from '../../redux/flash/flashActions';
import {connect} from 'react-redux';
import axios from 'axios';
import {get as _get} from 'lodash';
import ROUTES from '../../app/constants/routes';
import {setCurrentUser} from '../../redux/user/userActions';
import * as PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import SignInFormFooter from './SignInFormFooter';

const getInitialFormData = () => ({
    email: '',
    password: '',
});

const validateFormData = (formData, setErrors) => {
    const formValidator = NewFormValidator(formData);

    formValidator.required(['email', 'password']);
    formValidator.isEmail(['email']);
    formValidator.maxLength(['email'], 320);
    formValidator.maxLength(['password'], 128);

    if (!formValidator.isValid()) {
        setErrors(formValidator.errors);
        return false;
    }

    return true;
};

const SignInForm = ({addSuccessMessage, setCurrentUser}) => {
    const [formData, setFormData] = useState(getInitialFormData()),
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
                const successMessage = 'Successfully signed in.';

                axios.post(ROUTES.api.signIn, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(
                        (response) => {
                            setErrors({});
                            addSuccessMessage(successMessage);

                            const result = response.data.result;
                            setCurrentUser({
                                user: result.user,
                                jwt: result.jwt,
                            });
                            navigate(ROUTES.users.profileDetails);
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
        };

    return <form className='form form--untitled' method='POST' onSubmit={handleSubmit}>
        <SignInFormFields onValueChange={onValueChange} formData={formData} errors={errors}/>
        <SignInFormFooter error={errors.general}/>
    </form>;
};

SignInForm.propTypes = {
    addSuccessMessage: PropTypes.func,
    setCurrentUser: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
    setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(SignInForm);
