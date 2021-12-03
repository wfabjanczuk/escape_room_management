import React from 'react';
import {Link} from 'react-router-dom';
import * as PropTypes from 'prop-types';
import {getRouteWithParams} from '../../constants/routes';

const ListingActions = ({route, id}) => (<ul className='listing__actions'>
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
        <Link className='button button--danger hoverable' to={getRouteWithParams(route.delete, {id: id})}>
            Delete
        </Link>
    </li>
</ul>);

ListingActions.propTypes = {
    id: PropTypes.number,
    route: PropTypes.object,
};

export default ListingActions;