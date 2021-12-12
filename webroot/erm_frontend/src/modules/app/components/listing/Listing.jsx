import React from 'react';
import ListingWide from './ListingWide';
import ListingCompact from './ListingCompact';
import * as PropTypes from 'prop-types';
import Footer from './Footer';

const Listing = (
    {
        error,
        isLoading,
        rows,
        noRowsText,
        columns,
        actionsRoute,
        getDeletePromise,
        buttonText,
        buttonUrl
    }
) => {
    if (error) {
        return <p>{error.message}</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (0 === rows.length) {
        return <div className='listing'>
            <p>{noRowsText}</p>
            <Footer buttonText={buttonText} buttonUrl={buttonUrl}/>
        </div>;
    }

    return <React.Fragment>
        <ListingWide rows={rows} columns={columns}
                     actionsRoute={actionsRoute} getDeletePromise={getDeletePromise}
                     buttonText={buttonText} buttonUrl={buttonUrl}/>
        <ListingCompact rows={rows} columns={columns}
                        actionsRoute={actionsRoute} getDeletePromise={getDeletePromise}
                        buttonText={buttonText} buttonUrl={buttonUrl}/>
    </React.Fragment>;
};

Listing.propTypes = {
    error: PropTypes.object,
    isLoading: PropTypes.bool,
    rows: PropTypes.array,
    noRowsText: PropTypes.string,
    columns: PropTypes.array,
    actionsRoute: PropTypes.object,
    getDeletePromise: PropTypes.func,
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
};

export default Listing;