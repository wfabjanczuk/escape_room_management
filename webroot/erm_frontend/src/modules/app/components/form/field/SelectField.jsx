import React from 'react';
import Label from '../Label';
import Error from '../Error';

const SelectField = ({name, displayName, isRequired, isDisabled, errorMessage, value, onChange}) => {
    return <React.Fragment>
        <Label name={name} displayName={displayName} isRequired={isRequired}/>
        <select
            className={`form__field ${errorMessage ? 'form__field--error' : ''}`}
            name={name}
            id={name}
            value={value}
            disabled={isDisabled}
            onChange={onChange}
        />
        <Error name={name} errorMessage={errorMessage}/>
    </React.Fragment>;
};

export default SelectField;