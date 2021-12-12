import React from 'react';
import {connect} from 'react-redux';
import Message from './Message';

const FlashMessenger = ({messages}) => {
    if (0 === messages.length) {
        return null;
    }

    return (<React.Fragment>
        {messages.map(m => <Message key={m.id} id={m.id} type={m.type} content={m.content}/>)}
    </React.Fragment>);
};

const mapStateToProps = (state) => ({
    messages: state.flash.messages,
});

export default connect(mapStateToProps)(FlashMessenger);
