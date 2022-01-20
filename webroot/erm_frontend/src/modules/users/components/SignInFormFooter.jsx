import React from 'react';
import * as PropTypes from 'prop-types';

const SignInFormFooter = ({error}) => (<div className='form__footer'>
    {error && <span className='form__error form__error--summary'>{error}</span>}
    <input className='button button--success hoverable' type='submit' value='Sign in'/>
</div>);

SignInFormFooter.propTypes = {
    error: PropTypes.string,
};

export default SignInFormFooter;
