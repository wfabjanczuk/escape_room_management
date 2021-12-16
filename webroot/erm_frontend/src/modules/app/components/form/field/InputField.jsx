import React from 'react';
import Label from '../Label';
import Error from '../Error';
import * as PropTypes from 'prop-types';

const InputField = ({name, displayName, isRequired, isDisabled, type, errorMessage, value, onChange}) => {
    return <React.Fragment>
        <Label name={name} displayName={displayName} isRequired={isRequired}/>
        <input
            className={`form__field ${errorMessage ? 'form__field--error' : ''}`}
            type={type}
            name={name}
            id={name}
            value={value}
            disabled={isDisabled}
            onChange={onChange}
            formNoValidate={true}
        />
        <Error name={name} errorMessage={errorMessage}/>
    </React.Fragment>;
};

InputField.propTypes = {
    name: PropTypes.string,
    displayName: PropTypes.string,
    isRequired: PropTypes.bool,
    isDisabled: PropTypes.bool,
    type: PropTypes.string,
    errorMessage: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
};

export default InputField;