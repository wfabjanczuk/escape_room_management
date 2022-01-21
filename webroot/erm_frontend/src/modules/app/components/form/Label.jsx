import React from 'react';
import * as PropTypes from 'prop-types';

const Label = ({name, displayName, isRequired, isDisabled}) => (<label htmlFor={name}>
    {`${displayName}: `}
    {!isDisabled && isRequired && <span className='form__symbol-required'>*</span>}
</label>);

Label.propTypes = {
    name: PropTypes.string,
    displayName: PropTypes.string,
    isRequired: PropTypes.bool,
    isDisabled: PropTypes.bool,
};


export default Label;