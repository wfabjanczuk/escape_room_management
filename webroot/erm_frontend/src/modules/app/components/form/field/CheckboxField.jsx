import React from 'react';
import Label from '../Label';
import Error from '../Error';
import * as PropTypes from 'prop-types';

const CheckboxField = ({name, displayName, isRequired, isDisabled, errorMessage, defaultChecked, onChange}) => {
    return <React.Fragment>
        <Label name={name} displayName={displayName} isRequired={isRequired} isDisabled={isDisabled}/>
        <div className='form__field form__field--checkbox'>
            <input
                type='checkbox'
                value='1'
                className={`form__field ${errorMessage ? 'form__field--error' : ''}`}
                name={name}
                id={name}
                disabled={isDisabled}
                onChange={onChange}
                defaultChecked={defaultChecked}
            />
        </div>
        <Error name={name} errorMessage={errorMessage}/>
    </React.Fragment>;
};

CheckboxField.propTypes = {
    name: PropTypes.string,
    displayName: PropTypes.string,
    isRequired: PropTypes.bool,
    isDisabled: PropTypes.bool,
    errorMessage: PropTypes.string,
    defaultChecked: PropTypes.bool,
    onChange: PropTypes.func,
};

export default CheckboxField;