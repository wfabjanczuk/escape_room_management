import React, {useEffect, useState} from 'react';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {removeMessage} from '../../../redux/flash/flashActions';

const waitTime = 5000;

const Message = ({id, type, content, removeMessage}) => {
    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        if (isHover) {
            return;
        }

        const timeout = setTimeout(() => removeMessage(id), waitTime);
        return () => clearTimeout(timeout);
    }, [id, isHover, removeMessage]);

    return <div className={`alert alert--${type}`}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
    >
        <span className='alert__message'>{content}</span>
        <span className='alert__close' onClick={() => removeMessage(id)}>x</span>
    </div>;
};

Message.propTypes = {
    id: PropTypes.number,
    key: PropTypes.number,
    type: PropTypes.string,
    content: PropTypes.string,
    removeMessage: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
    removeMessage: (id) => dispatch(removeMessage(id)),
});

export default connect(null, mapDispatchToProps)(Message);
