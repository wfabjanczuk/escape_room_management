import React from "react";
import ListingWide from "./ListingWide";
import ListingCompact from "./ListingCompact";
import * as PropTypes from "prop-types";

const Listing = ({title, isLoading, rows, columns}) => {
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
    title: PropTypes.string,
    isLoading: PropTypes.bool,
    rows: PropTypes.array,
    columns: PropTypes.array,
}

export default Listing;