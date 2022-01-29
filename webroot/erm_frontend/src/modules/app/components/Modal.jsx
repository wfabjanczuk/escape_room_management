import React from 'react';

const Modal = () => (
    <div className='modal modal--hidden'>
        <div className='modal__content'>
            <div className='modal__statement'>
                <div className='modal__question'>
                    Are you sure?
                </div>
                <div>
                    <div className='button button--danger hoverable'>
                        Yes
                    </div>
                    <div className='button button--secondary hoverable'>
                        Cancel
                    </div>
                </div>
            </div>
            <span className='close'>&times;</span>
        </div>
    </div>
);

export default Modal;