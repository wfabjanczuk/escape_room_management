import React from 'react';
import * as PropTypes from 'prop-types';

const Label = ({name, displayName, isRequired}) => (<label htmlFor={name}>
    {`${displayName}: `}
    {isRequired && <span className='form__symbol-required'>*</span>}
</label>);

Label.propTypes = {
    name: PropTypes.string,
    displayName: PropTypes.string,
    isRequired: PropTypes.bool,
};


export default Label;