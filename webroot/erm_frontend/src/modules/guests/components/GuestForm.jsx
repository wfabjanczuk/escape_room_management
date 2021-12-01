import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import * as PropTypes from 'prop-types';
import InputField from '../../app/components/form/InputField';
import {maxLength, minMaxInt, required} from '../../app/utils/formValidators';

const getInitialFormData = (guest) => {
    if (guest) {
        return {
            ...guest,
            discountPercent: (guest.discountPercent || 0 === guest.discountPercent) ? guest.discountPercent : '',
        };
    }

    return {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateBirth: '',
        discountPercent: '',
    };
};

const validateFormData = (formData, setErrors) => {
    const errors = {};

    required(['firstName', 'lastName', 'email', 'phoneNumber', 'dateBirth'], formData, errors);

    maxLength(50, ['firstName', 'lastName'], formData, errors);
    maxLength(100, ['email'], formData, errors);
    maxLength(12, ['phoneNumber'], formData, errors);

    minMaxInt(0, 20, ['discountPercent'], formData, errors);

    if (0 < Object.keys(formData).length) {
        setErrors(errors);

        return false;
    }

    return true;
};

const GuestForm = ({guest}) => {
    const cancelUrl = guest ? `/guests/${guest.id}/details` : '/guests',
        [formData, setFormData] = useState(getInitialFormData(guest)),
        [errors, setErrors] = useState({}),
        onValueChange = (event) => {
            setFormData(formData => ({
                ...formData,
                [event.target.name]: event.target.value,
            }))
        },
        handleSubmit = (event) => {
            console.log(event);
            validateFormData(formData, setErrors);
            event.preventDefault();
        };

    return <form className='form' method='POST' onSubmit={handleSubmit}>
        <InputField
            type='text'
            name='firstName'
            displayName='First name'
            isRequired={true}
            errorMessage={errors.firstName}
            value={formData.firstName}
            onChange={onValueChange}
        />
        <InputField
            type='text'
            name='lastName'
            displayName='Last name'
            isRequired={true}
            errorMessage={errors.lastName}
            value={formData.lastName}
            onChange={onValueChange}
        />
        <InputField
            type='text'
            name='email'
            displayName='Email'
            isRequired={true}
            errorMessage={errors.email}
            value={formData.email}
            onChange={onValueChange}
        />
        <InputField
            type='text'
            name='phoneNumber'
            displayName='Phone number'
            isRequired={true}
            errorMessage={errors.phoneNumber}
            value={formData.phoneNumber}
            onChange={onValueChange}
        />
        <InputField
            type='date'
            name='dateBirth'
            displayName='Date of birth'
            isRequired={true}
            errorMessage={errors.dateBirth}
            value={formData.dateBirth}
            onChange={onValueChange}
        />
        <InputField
            type='number'
            name='discountPercent'
            displayName='Discount percent'
            isRequired={false}
            errorMessage={errors.discountPercent}
            value={formData.discountPercent}
            onChange={onValueChange}
        />

        <div className='form__footer'>
            <input className='button button--success hoverable' type='submit' value='Save'/>
            <Link className='button button--secondary hoverable' to={cancelUrl}>
                Cancel
            </Link>
        </div>

        <div>
            <pre>
                {JSON.stringify(formData, null, 2)}
            </pre>
        </div>
    </form>;
}

GuestForm.propTypes = {
    guest: PropTypes.object,
};

export default GuestForm;