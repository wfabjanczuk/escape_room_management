import React from 'react';
import * as PropTypes from 'prop-types';
import TextareaField from '../../app/components/form/field/TextareaField';
import InputField from '../../app/components/form/field/InputField';
import SelectField from '../../app/components/form/field/SelectField';
import {connect} from 'react-redux';

const ReviewFormFields = (
    {
        entityExists,
        roomOptions,
        guestOptions,
        isDisabled,
        onValueChange,
        formData,
        errors,
        currentUser
    }
) => (<React.Fragment>
    {entityExists && <input type='hidden' name='id' value={formData.id}/>}
    {currentUser.guestId
        ? <input type='hidden' name='guestId' value={currentUser.guestId}/>
        : <SelectField
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
    }
    <SelectField
        name={currentUser.guestId && entityExists ? '' : 'roomId'}
        displayName='Room'
        placeholderLabel='-- select room --'
        options={roomOptions}
        isRequired={true}
        isDisabled={isDisabled || currentUser.guestId > 0 && entityExists}
        errorMessage={errors.roomId}
        value={formData.roomId}
        onChange={onValueChange}
    />
    {currentUser.guestId > 0 && entityExists &&
        <input type='hidden' name='roomId' value={formData.roomId}/>
    }
    <InputField
        type='number'
        name='rating'
        displayName='Rating'
        isRequired={true}
        isDisabled={isDisabled}
        errorMessage={errors.rating}
        value={formData.rating}
        onChange={onValueChange}
    />
    <TextareaField
        name='comment'
        displayName='Comment'
        isRequired={false}
        isDisabled={isDisabled}
        maxLength={300}
        errorMessage={errors.comment}
        value={formData.comment}
        onChange={onValueChange}
    />
    {(!currentUser.guestId || entityExists)
        ? <TextareaField
            name='reply'
            displayName='Reply'
            isRequired={false}
            isDisabled={currentUser.guestId > 0 || isDisabled}
            maxLength={300}
            errorMessage={errors.reply}
            value={formData.reply}
            onChange={onValueChange}
        />
        : <input type='hidden' name='reply' value={formData.reply}/>
    }
</React.Fragment>);

ReviewFormFields.propTypes = {
    entityExists: PropTypes.bool,
    roomOptions: PropTypes.array,
    guestOptions: PropTypes.array,
    isDisabled: PropTypes.bool,
    onValueChange: PropTypes.func,
    formData: PropTypes.object,
    errors: PropTypes.object,
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(ReviewFormFields);