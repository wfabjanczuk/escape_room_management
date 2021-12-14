import React from 'react';
import Label from '../Label';
import Error from '../Error';

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

export default InputField;