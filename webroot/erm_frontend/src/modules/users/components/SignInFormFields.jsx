import React from 'react';
import InputField from '../../app/components/form/field/InputField';
import * as PropTypes from 'prop-types';

const SignInFormFields = ({onValueChange, formData, errors}) => (<React.Fragment>
    <InputField
        type='text'
        name='email'
        displayName='Email'
        isRequired={true}
        isDisabled={false}
        errorMessage={errors.email}
        value={formData.email}
        onChange={onValueChange}
    />
    <InputField
        type='password'
        name='password'
        displayName='Password'
        isRequired={true}
        isDisabled={false}
        errorMessage={errors.password}
        value={formData.password}
        onChange={onValueChange}
    />
</React.Fragment>);

SignInFormFields.propTypes = {
    onValueChange: PropTypes.func,
    formData: PropTypes.object,
    errors: PropTypes.object,
};

export default SignInFormFields;