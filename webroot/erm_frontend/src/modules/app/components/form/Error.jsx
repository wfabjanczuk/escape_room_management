import React from 'react';
import * as PropTypes from 'prop-types';

const Error = ({name, errorMessage}) => (
    <span className='form__error' id={`${name}Error`}>{errorMessage}</span>);

Error.propTypes = {
    name: PropTypes.string,
    errorMessage: PropTypes.string,
};


export default Error;