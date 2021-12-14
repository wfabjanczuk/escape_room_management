import React from 'react';
import Label from '../Label';
import Error from '../Error';

const CheckboxField = ({name, displayName, isRequired, isDisabled, errorMessage, value, onChange}) => {
    return <React.Fragment>
        <Label name={name} displayName={displayName} isRequired={isRequired}/>
        <div className='form__field form__field--checkbox'>
            <input
                type='checkbox'
                className={`form__field ${errorMessage ? 'form__field--error' : ''}`}
                name={name}
                id={name}
                value={value}
                disabled={isDisabled}
                onChange={onChange}
            />
        </div>
        <Error name={name} errorMessage={errorMessage}/>
    </React.Fragment>;
};

export default CheckboxField;