import React from 'react';
import {Link} from 'react-router-dom';
import * as PropTypes from 'prop-types';

const ListingActions = ({route, id}) => (<ul className='listing__actions'>
    <li className='action'>
        <Link className='button button--primary hoverable' to={`${route}/${id}/details`}>
            Details
        </Link>
    </li>
    <li className='action'>
        <Link className='button button--warning hoverable' to={`${route}/${id}/edit`}>
            Edit
        </Link>
    </li>
    <li className='action'>
        <Link className='button button--danger hoverable' to={`${route}/${id}/delete`}>
            Delete
        </Link>
    </li>
</ul>);

ListingActions.propTypes = {
    id: PropTypes.number,
    route: PropTypes.string,
};

export default ListingActions;