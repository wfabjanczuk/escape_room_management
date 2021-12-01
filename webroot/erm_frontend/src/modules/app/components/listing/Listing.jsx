import React from 'react';
import ListingWide from './ListingWide';
import ListingCompact from './ListingCompact';
import * as PropTypes from 'prop-types';

const Listing = ({error, isLoading, rows, columns, actionsRoute}) => {
    if (error) {
        return <React.Fragment>
            <p>{error.message}</p>
        </React.Fragment>;
    }

    if (isLoading) {
        return <React.Fragment>
            <p>Loading...</p>
        </React.Fragment>;
    }

    return <React.Fragment>
        <ListingWide rows={rows} columns={columns} actionsRoute={actionsRoute}/>
        <ListingCompact rows={rows} columns={columns} actionsRoute={actionsRoute}/>
    </React.Fragment>;
};

Listing.propTypes = {
    error: PropTypes.object,
    isLoading: PropTypes.bool,
    rows: PropTypes.array,
    columns: PropTypes.array,
    actionsRoute: PropTypes.string,
};

export default Listing;