import React from "react";
import ListingWide from "./ListingWide";
import ListingCompact from "./ListingCompact";
import * as PropTypes from "prop-types";

const Listing = ({error, isLoading, title, rows, columns}) => {
    if (error) {
        return <React.Fragment>
            <h2>{title}</h2>
            <p>{error.message}</p>
        </React.Fragment>;
    }

    if (isLoading) {
        return <React.Fragment>
            <h2>{title}</h2>
            <p>Loading...</p>
        </React.Fragment>;
    }

    return <React.Fragment>
        <h2>{title}</h2>
        <ListingWide rows={rows} columns={columns}/>
        <ListingCompact rows={rows} columns={columns}/>
    </React.Fragment>;
};

Listing.propTypes = {
    error: PropTypes.object,
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    rows: PropTypes.array,
    columns: PropTypes.array,
}

export default Listing;