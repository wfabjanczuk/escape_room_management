import React from 'react';
import * as PropTypes from 'prop-types';
import SelectField from '../../app/components/form/field/SelectField';
import CheckboxField from '../../app/components/form/field/CheckboxField';
import MoneyField from '../../app/components/form/field/MoneyField';

const TicketFormFields = (
    {
        entityExists,
        reservationOptions,
        guestOptions,
        isDisabled,
        onValueChange,
        forceValueChange,
        formData,
        errors
    }
) => (<React.Fragment>
    {entityExists && <input type='hidden' name='id' value={formData.id}/>}
    <SelectField
        name='reservationId'
        displayName='Reservation'
        placeholderLabel='-- select reservation --'
        options={reservationOptions}
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.reservationId}
        value={formData.reservationId}
        onChange={onValueChange}
    />
    <SelectField
        name='guestId'
        displayName='Guest'
        placeholderLabel='-- select guest --'
        options={guestOptions}
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.guestId}
        value={formData.guestId}
        onChange={onValueChange}
    />
    <MoneyField
        name='price'
        displayName='Price'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.price}
        value={formData.price}
        onChange={onValueChange}
        forceValueChange={forceValueChange}
    />
    <CheckboxField
        type='number'
        name='guestAllowedToCancel'
        displayName='Is guest allowed to cancel reservation'
        isRequired={false}
        isDisabled={isDisabled}
        errorMessage={errors.guestAllowedToCancel}
        defaultChecked={!!formData.guestAllowedToCancel}
        onChange={onValueChange}
    />
</React.Fragment>);

TicketFormFields.propTypes = {
    entityExists: PropTypes.bool,
    reservationOptions: PropTypes.array,
    guestOptions: PropTypes.array,
    isDisabled: PropTypes.bool,
    onValueChange: PropTypes.func,
    forceValueChange: PropTypes.func,
    formData: PropTypes.object,
    errors: PropTypes.object,
};

export default TicketFormFields;