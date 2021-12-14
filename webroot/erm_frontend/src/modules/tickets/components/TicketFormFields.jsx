import React from 'react';
import InputField from '../../app/components/form/field/InputField';
import * as PropTypes from 'prop-types';
import SelectField from '../../app/components/form/field/SelectField';
import CheckboxField from '../../app/components/form/field/CheckboxField';

const TicketFormFields = ({entityExists, isDisabled, onValueChange, formData, errors}) => (<React.Fragment>
    {entityExists && <input type='hidden' name='id' value={formData.id}/>}
    <SelectField
        name='reservationId'
        displayName='Reservation'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.reservationId}
        value={formData.reservationId}
        onChange={onValueChange}
    />
    <SelectField
        name='guestId'
        displayName='Guest'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.guestId}
        value={formData.guestId}
        onChange={onValueChange}
    />
    <InputField
        type='number'
        name='price'
        displayName='Price'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.price}
        value={formData.price}
        onChange={onValueChange}
    />
    <CheckboxField
        type='number'
        name='guestAllowedToCancel'
        displayName='Is guest allowed to cancel reservation'
        isRequired={false}
        isDisabled={isDisabled}
        errorMessage={errors.guestAllowedToCancel}
        value={formData.guestAllowedToCancel}
        onChange={onValueChange}
    />
</React.Fragment>);

TicketFormFields.propTypes = {
    entityExists: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onValueChange: PropTypes.func,
    formData: PropTypes.object,
    errors: PropTypes.object,
};

export default TicketFormFields;