import React from 'react';
import CheckboxField from '../../app/components/form/field/CheckboxField';
import InputField from '../../app/components/form/field/InputField';
import * as PropTypes from 'prop-types';

const GuestFormFields = ({entityExists, isDisabled, onValueChange, formData, errors}) => (<React.Fragment>
    {entityExists && <input type='hidden' name='id' value={formData.id}/>}
    <InputField
        type='text'
        name='firstName'
        displayName='First name'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.firstName}
        value={formData.firstName}
        onChange={onValueChange}
    />
    <InputField
        type='text'
        name='lastName'
        displayName='Last name'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.lastName}
        value={formData.lastName}
        onChange={onValueChange}
    />
    <InputField
        type='text'
        name='email'
        displayName='Email'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.email}
        value={formData.email}
        onChange={onValueChange}
    />
    <InputField
        type='text'
        name='phoneNumber'
        displayName='Phone number'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.phoneNumber}
        value={formData.phoneNumber}
        onChange={onValueChange}
    />
    <InputField
        type='date'
        name='dateBirth'
        displayName='Date of birth'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.dateBirth}
        value={formData.dateBirth}
        onChange={onValueChange}
    />
    <InputField
        type='number'
        name='discountPercent'
        displayName='Discount percent'
        isRequired={false}
        isDisabled={isDisabled}
        errorMessage={errors.discountPercent}
        value={formData.discountPercent}
        onChange={onValueChange}
    />
    <h3 className='form__section'>Account</h3>
    {!isDisabled && <InputField
        type='password'
        name='password'
        displayName={entityExists ? 'New password' : 'Password'}
        isRequired={false}
        isDisabled={false}
        errorMessage={errors.password}
        value={formData.password}
        onChange={onValueChange}
    />}
    <CheckboxField
        name='isActive'
        displayName='Active'
        isRequired={false}
        isDisabled={isDisabled}
        errorMessage={errors.isActive}
        defaultChecked={!!formData.isActive}
        onChange={onValueChange}
    />
</React.Fragment>);

GuestFormFields.propTypes = {
    entityExists: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onValueChange: PropTypes.func,
    formData: PropTypes.object,
    errors: PropTypes.object,
};

export default GuestFormFields;