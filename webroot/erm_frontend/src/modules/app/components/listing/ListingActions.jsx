import React from "react";
import {Link} from "react-router-dom";

const ListingActions = () => (<ul className="listing__actions">
    <li className="action">
        <Link className="button button--primary hoverable" to="/guests">
            Details
        </Link>
    </li>
    <li className="action">
        <Link className="button button--warning hoverable" to="/guests">
            Edit
        </Link>
    </li>
    <li className="action">
        <Link className="button button--danger hoverable" to="/guests">
            Delete
        </Link>
    </li>
</ul>);

export default ListingActions;