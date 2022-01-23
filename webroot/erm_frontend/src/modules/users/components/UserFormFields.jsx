import React from 'react';
import InputField from '../../app/components/form/field/InputField';
import CheckboxField from '../../app/components/form/field/CheckboxField';
import SelectField from '../../app/components/form/field/SelectField';
import * as PropTypes from 'prop-types';

const UserFormFields = (
    {
        entityExists,
        roleOptions,
        isDisabled,
        isProfile,
        onValueChange,
        formData,
        errors
    }
) => (<React.Fragment>
    {entityExists && <input type='hidden' name='id' value={formData.id}/>}
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
    {!isDisabled && <InputField
        type='password'
        name='password'
        displayName={entityExists ? 'New password' : 'Password'}
        isRequired={!entityExists}
        isDisabled={isDisabled}
        errorMessage={errors.password}
        value={formData.password}
        onChange={onValueChange}
    />}
    {!isDisabled && isProfile && <InputField
        type='password'
        name='confirmPassword'
        displayName='Confirm password'
        isRequired={!entityExists}
        isDisabled={isDisabled}
        errorMessage={errors.confirmPassword}
        value={formData.confirmPassword}
        onChange={onValueChange}
    />}
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
    {isProfile
        ? <input type='hidden' name='isActive' value='1'/>
        : <React.Fragment>
            <SelectField
                name='roleId'
                displayName='Role'
                placeholderLabel='-- select role --'
                options={roleOptions}
                isRequired={true}
                isDisabled={isDisabled || entityExists}
                errorMessage={errors.roleId}
                value={formData.roleId}
                onChange={onValueChange}
            />
            <CheckboxField
                name='isActive'
                displayName='Active'
                isRequired={false}
                isDisabled={isDisabled}
                errorMessage={errors.isActive}
                defaultChecked={!!formData.isActive}
                onChange={onValueChange}
            />
        </React.Fragment>
    }
</React.Fragment>);

UserFormFields.propTypes = {
    entityExists: PropTypes.bool,
    roleOptions: PropTypes.array,
    isDisabled: PropTypes.bool,
    isProfile: PropTypes.bool,
    onValueChange: PropTypes.func,
    formData: PropTypes.object,
    errors: PropTypes.object,
};

export default UserFormFields;