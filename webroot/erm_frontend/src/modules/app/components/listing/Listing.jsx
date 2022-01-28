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
        buttonUrl,
        actionsRenderer,
        isGuestAuthorized = false,
        renderActions = true,
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
            <Footer buttonText={buttonText} buttonUrl={buttonUrl} isGuestAuthorized={isGuestAuthorized}/>
        </div>;
    }

    return <React.Fragment>
        <ListingWide
            rows={rows}
            columns={columns}
            actionsRoute={actionsRoute}
            getDeletePromise={getDeletePromise}
            isGuestAuthorized={isGuestAuthorized}
            buttonText={buttonText}
            buttonUrl={buttonUrl}
            renderActions={renderActions}
            actionsRenderer={actionsRenderer}
        />
        <ListingCompact
            rows={rows}
            columns={columns}
            actionsRoute={actionsRoute}
            getDeletePromise={getDeletePromise}
            isGuestAuthorized={isGuestAuthorized}
            buttonText={buttonText}
            buttonUrl={buttonUrl}
            renderActions={renderActions}
            actionsRenderer={actionsRenderer}
        />
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
    isGuestAuthorized: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
    actionsRenderer: PropTypes.func,
    renderActions: PropTypes.bool,
};

export default Listing;