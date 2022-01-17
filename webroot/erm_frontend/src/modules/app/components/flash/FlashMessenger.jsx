import React from 'react';
import {connect} from 'react-redux';
import Message from './Message';
import * as PropTypes from 'prop-types';

const FlashMessenger = ({messages}) => {
    if (0 === messages.length) {
        return null;
    }

    return (<React.Fragment>
        {messages.map(m => <Message key={m.id} id={m.id} type={m.type} content={m.content}/>)}
    </React.Fragment>);
};

FlashMessenger.propTypes = {
    messages: PropTypes.array,
};

const mapStateToProps = (state) => ({
    messages: state.flash.messages,
});

export default connect(mapStateToProps)(FlashMessenger);
