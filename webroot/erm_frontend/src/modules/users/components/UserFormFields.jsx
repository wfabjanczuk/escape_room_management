import React from 'react';
import InputField from '../../app/components/form/field/InputField';
import * as PropTypes from 'prop-types';

const UserFormFields = ({onValueChange, formData, errors}) => (<React.Fragment>
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
    <InputField
        type='password'
        name='confirmPassword'
        displayName='Confirm password'
        isRequired={true}
        isDisabled={false}
        errorMessage={errors.confirmPassword}
        value={formData.confirmPassword}
        onChange={onValueChange}
    />
    <InputField
        type='text'
        name='firstName'
        displayName='First name'
        isRequired={true}
        isDisabled={false}
        errorMessage={errors.firstName}
        value={formData.firstName}
        onChange={onValueChange}
    />
    <InputField
        type='text'
        name='lastName'
        displayName='Last name'
        isRequired={true}
        isDisabled={false}
        errorMessage={errors.lastName}
        value={formData.lastName}
        onChange={onValueChange}
    />
    <InputField
        type='text'
        name='phoneNumber'
        displayName='Phone number'
        isRequired={true}
        isDisabled={false}
        errorMessage={errors.phoneNumber}
        value={formData.phoneNumber}
        onChange={onValueChange}
    />
    <InputField
        type='date'
        name='dateBirth'
        displayName='Date of birth'
        isRequired={true}
        isDisabled={false}
        errorMessage={errors.dateBirth}
        value={formData.dateBirth}
        onChange={onValueChange}
    />
</React.Fragment>);

UserFormFields.propTypes = {
    onValueChange: PropTypes.func,
    formData: PropTypes.object,
    errors: PropTypes.object,
};

export default UserFormFields;