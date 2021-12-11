import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import * as PropTypes from 'prop-types';
import ROUTES, {getRouteWithParams} from '../../constants/routes';
import axios from 'axios';
import {connect} from 'react-redux';
import {addErrorMessage, addSuccessMessage} from '../../../redux/flash/flashActions';
import {get as _get} from 'lodash';


const ListingActions = ({id, route, apiEndpoint, addSuccessMessage, addErrorMessage}) => {
    const navigate = useNavigate();

    const handleDelete = (apiEndpoint, id) => {
        const url = getRouteWithParams(apiEndpoint, {id: id}),
            successMessage = 'Guest deleted successfully.',
            defaultErrorMessage = 'Guest could not be deleted.';

        axios.delete(url)
            .then(
                (response) => {
                    addSuccessMessage(successMessage);
                    navigate(ROUTES.guests.index);
                },
                (error) => {
                    const errorResponse = JSON.parse(error.request.response),
                        errorMessage = _get(errorResponse, 'error.message', '');

                    addErrorMessage(`${defaultErrorMessage} ${errorMessage}`);
                },
            );
    };

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
            <div className='button button--danger hoverable'
                 onClick={() => handleDelete(apiEndpoint, id, addSuccessMessage)}>
                Delete
            </div>
        </li>
    </ul>;
};

ListingActions.propTypes = {
    id: PropTypes.number,
    route: PropTypes.object,
    apiEndpoint: PropTypes.string,
    addSuccessMessage: PropTypes.func,
    addErrorMessage: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
    addErrorMessage: (content) => dispatch(addErrorMessage(content)),
});

export default connect(null, mapDispatchToProps)(ListingActions);