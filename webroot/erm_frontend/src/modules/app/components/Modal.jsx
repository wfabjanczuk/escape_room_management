import React from 'react';
import {connect} from 'react-redux';
import {hideModal} from '../redux/modal/modalActions';
import * as PropTypes from 'prop-types';

const Modal = ({isVisible, onConfirm, hideModal}) => (
    <div className={'modal' + (isVisible ? '' : ' modal--hidden')}>
        <div className='modal__content'>
            <div className='modal__statement'>
                <div className='modal__question'>
                    Are you sure?
                </div>
                <div>
                    <div className='button button--danger hoverable' onClick={() => {
                        onConfirm();
                        hideModal();
                    }}>
                        Confirm
                    </div>
                    <div className='button button--secondary hoverable' onClick={hideModal}>
                        Cancel
                    </div>
                </div>
            </div>
            <span className='close' onClick={hideModal}>&times;</span>
        </div>
    </div>
);

Modal.propTypes = {
    isVisible: PropTypes.bool,
    onConfirm: PropTypes.func,
    hideModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
    isVisible: state.modal.isVisible,
    onConfirm: state.modal.onConfirm,
});

const mapDispatchToProps = (dispatch) => ({
    hideModal: () => dispatch(hideModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);