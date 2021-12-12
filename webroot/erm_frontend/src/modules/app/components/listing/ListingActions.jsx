import React from 'react';
import {Link} from 'react-router-dom';
import * as PropTypes from 'prop-types';
import {getRouteWithParams} from '../../constants/routes';
import {connect} from 'react-redux';
import {addErrorMessage, addSuccessMessage} from '../../../redux/flash/flashActions';

const ListingActions = ({id, route, getDeletePromise, addSuccessMessage, addErrorMessage}) => {
    const onDelete = () => getDeletePromise(id, addSuccessMessage, addErrorMessage);

    return <ul className='listing__actions'>
        <li className='action'>
            <Link className='button button--primary hoverable' to={getRouteWithParams(route.details, {id: id})}>
                Details
            </Link>
        </li>
        <li className='action'>
            <Link className='button button--warning hoverable' to={getRouteWithParams(route.edit, {id: id})}>
                Edit
            </Link>
        </li>
        <li className='action'>
            <div className='button button--danger hoverable' onClick={onDelete}>
                Delete
            </div>
        </li>
    </ul>;
};

ListingActions.propTypes = {
    id: PropTypes.number,
    route: PropTypes.object,
    getDeletePromise: PropTypes.func,
    addSuccessMessage: PropTypes.func,
    addErrorMessage: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
    addErrorMessage: (content) => dispatch(addErrorMessage(content)),
});

export default connect(null, mapDispatchToProps)(ListingActions);