import React from 'react';
import * as PropTypes from 'prop-types';
import {addErrorMessage, addSuccessMessage} from '../../../redux/flash/flashActions';
import {increaseChangeCounter} from '../../../redux/change/changeActions';
import {connect} from 'react-redux';

const Footer = ({submitText, submitWide, error}) => {
    const submitClassName = `button button--success ${submitWide ? 'button--wide' : ''} hoverable`;

    return <div className='form__footer'>
        {error && <span className='form__error form__error--summary'>{error}</span>}
        <input className={submitClassName} type='submit' value={submitText}/>
    </div>;
};

Footer.propTypes = {
    submitText: PropTypes.string,
    submitWide: PropTypes.bool,
    error: PropTypes.string,
};

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
    addErrorMessage: (content) => dispatch(addErrorMessage(content)),
    increaseChangeCounter: () => dispatch(increaseChangeCounter()),
});

export default connect(null, mapDispatchToProps)(Footer);
