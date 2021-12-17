import React from 'react';
import * as PropTypes from 'prop-types';
import SelectField from '../../app/components/form/field/SelectField';
import InputField from '../../app/components/form/field/InputField';
import ReadOnlyField from '../../app/components/form/field/ReadOnlyField';

const ReservationFormFields = (
    {
        entityExists,
        roomOptions,
        isDisabled,
        onValueChange,
        formData,
        errors,
        readOnlyValues
    }
) => (<React.Fragment>
    {entityExists && <input type='hidden' name='id' value={formData.id}/>}
    <SelectField
        name='roomId'
        displayName='Room'
        placeholderLabel='-- select room --'
        options={roomOptions}
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.roomId}
        value={formData.roomId}
        onChange={onValueChange}
    />
    <InputField
        type='datetime-local'
        name='dateFrom'
        displayName='Date from'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.dateFrom}
        value={formData.dateFrom}
        onChange={onValueChange}
    />
    <InputField
        type='datetime-local'
        name='dateTo'
        displayName='Date to'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.dateTo}
        value={formData.dateTo}
        onChange={onValueChange}
    />
    <InputField
        type='datetime-local'
        name='dateCancelled'
        displayName='Date cancelled'
        isRequired={false}
        isDisabled={isDisabled}
        errorMessage={errors.dateCancelled}
        value={formData.dateCancelled}
        onChange={onValueChange}
    />
    {isDisabled && <React.Fragment>
        <ReadOnlyField
            name='totalPrice'
            displayName='Total price'
            value={readOnlyValues.totalPrice}
        />
    </React.Fragment>}
</React.Fragment>);

ReservationFormFields.propTypes = {
    entityExists: PropTypes.bool,
    roomOptions: PropTypes.array,
    isDisabled: PropTypes.bool,
    onValueChange: PropTypes.func,
    formData: PropTypes.object,
    errors: PropTypes.object,
    readOnlyValues: PropTypes.object,
};

export default ReservationFormFields;