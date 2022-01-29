import React from 'react';
import * as PropTypes from 'prop-types';
import InputField from '../../app/components/form/field/InputField';
import MoneyField from '../../app/components/form/field/MoneyField';
import ReadOnlyField from '../../app/components/form/field/ReadOnlyField';

const RoomFormFields = (
    {
        entityExists,
        isDisabled,
        onValueChange,
        forceValueChange,
        formData,
        errors,
        readOnlyValues,
    }
) => (<React.Fragment>
    {entityExists && <input type='hidden' name='id' value={formData.id}/>}
    <InputField
        type='text'
        name='name'
        displayName='Room name'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.name}
        value={formData.name}
        onChange={onValueChange}
    />
    <MoneyField
        name='baseTicketPrice'
        displayName='Base ticket price'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.baseTicketPrice}
        value={formData.baseTicketPrice}
        onChange={onValueChange}
        forceValueChange={forceValueChange}
    />
    <InputField
        type='number'
        name='minParticipants'
        displayName='Min. participants'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.minParticipants}
        value={formData.minParticipants}
        onChange={onValueChange}
    />
    <InputField
        type='number'
        name='maxParticipants'
        displayName='Max. participants'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.maxParticipants}
        value={formData.maxParticipants}
        onChange={onValueChange}
    />
    <InputField
        type='number'
        name='minAge'
        displayName='Min. age'
        isRequired={false}
        isDisabled={isDisabled}
        errorMessage={errors.minAge}
        value={formData.minAge}
        onChange={onValueChange}
    />
    {isDisabled &&
        <ReadOnlyField
            name='averageRating'
            displayName='Avg. rating'
            value={readOnlyValues.averageRating}
        />
    }
</React.Fragment>);

RoomFormFields.propTypes = {
    entityExists: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onValueChange: PropTypes.func,
    forceValueChange: PropTypes.func,
    formData: PropTypes.object,
    errors: PropTypes.object,
    readOnlyValues: PropTypes.object,
};

export default RoomFormFields;