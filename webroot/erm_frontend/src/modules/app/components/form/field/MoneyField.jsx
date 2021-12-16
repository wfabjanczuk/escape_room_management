import React, {useEffect} from 'react';
import Label from '../Label';
import Error from '../Error';
import * as PropTypes from 'prop-types';

const waitTime = 400;

const MoneyField = ({name, displayName, isRequired, isDisabled, errorMessage, value, onChange, forceValueChange}) => {
    useEffect(() => {
        const formattedValue = Math.abs(parseFloat(value ? value : 0)).toFixed(2);

        if (value === formattedValue) {
            return;
        }

        const timeout = setTimeout(() => forceValueChange(name, formattedValue), waitTime);
        return () => clearTimeout(timeout);
    }, [name, value, forceValueChange]);

    return <React.Fragment>
        <Label name={name} displayName={displayName} isRequired={isRequired}/>
        <input
            type='number'
            step='0.01'
            className={`form__field ${errorMessage ? 'form__field--error' : ''}`}
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

MoneyField.propTypes = {
    name: PropTypes.string,
    displayName: PropTypes.string,
    isRequired: PropTypes.bool,
    isDisabled: PropTypes.bool,
    errorMessage: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    forceValueChange: PropTypes.func,
};

export default MoneyField;