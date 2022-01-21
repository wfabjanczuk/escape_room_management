import React from 'react';
import Label from '../Label';
import Error from '../Error';
import * as PropTypes from 'prop-types';

const SelectField = (
    {
        name,
        displayName,
        placeholderLabel,
        options,
        isRequired,
        isDisabled,
        errorMessage,
        value,
        onChange,
    }
) => {
    return <React.Fragment>
        <Label name={name} displayName={displayName} isRequired={isRequired} isDisabled={isDisabled}/>
        <select
            className={`form__field ${errorMessage ? 'form__field--error' : ''}`}
            name={name}
            id={name}
            value={value}
            disabled={isDisabled}
            onChange={onChange}
        >
            <option value=''>{placeholderLabel}</option>
            {options.map((o, oIndex) => (
                <option key={oIndex} value={o.id}>#{o.id} {o.label}</option>
            ))}
        </select>
        <Error name={name} errorMessage={errorMessage}/>
    </React.Fragment>;
};

SelectField.propTypes = {
    name: PropTypes.string,
    displayName: PropTypes.string,
    placeholderLabel: PropTypes.string,
    options: PropTypes.array,
    isRequired: PropTypes.bool,
    isDisabled: PropTypes.bool,
    errorMessage: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
};

export default SelectField;