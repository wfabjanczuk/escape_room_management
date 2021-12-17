import React from 'react';
import Label from '../Label';
import Error from '../Error';
import * as PropTypes from 'prop-types';

const ReadOnlyField = ({name, displayName, value}) => {
    return <React.Fragment>
        <Label name={name} displayName={displayName} isRequired={false}/>
        <input
            className='form__field'
            type='text'
            value={value}
            disabled={true}
            formNoValidate={true}
        />
        <Error name={name} errorMessage={''}/>
    </React.Fragment>;
};

ReadOnlyField.propTypes = {
    name: PropTypes.string,
    displayName: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ReadOnlyField;