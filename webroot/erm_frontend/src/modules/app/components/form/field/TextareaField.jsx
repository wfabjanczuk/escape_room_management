import React from 'react';
import Label from '../Label';
import Error from '../Error';
import * as PropTypes from 'prop-types';

const TextareaField = ({name, displayName, isRequired, isDisabled, maxLength, errorMessage, value, onChange}) => {
    return <React.Fragment>
        <Label name={name} displayName={displayName} isRequired={isRequired} isDisabled={isDisabled}/>
        {isDisabled
            ? <div className='form-cell form-cell--italic'>
                {value ? value : '-'}
                <input type='hidden' name='reply' value={value ? value : ''}/>
            </div>
            : <textarea
                className={`form__field ${errorMessage ? 'form__field--error' : ''}`}
                name={name}
                id={name}
                value={value}
                disabled={isDisabled}
                onChange={onChange}
                maxLength={maxLength}
            />
        }
        <Error name={name} errorMessage={errorMessage}/>
    </React.Fragment>;
};

TextareaField.propTypes = {
    name: PropTypes.string,
    displayName: PropTypes.string,
    isRequired: PropTypes.bool,
    isDisabled: PropTypes.bool,
    maxLength: PropTypes.number,
    errorMessage: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
};

export default TextareaField;