import React from "react";
import {Link} from "react-router-dom";
import ListingActions from "./ListingActions";
import * as PropTypes from "prop-types";

const ListingCompact = ({rows, columns}) => (
    <React.Fragment>
        <div className="listing listing--compact">
            <table className="listing__table listing__table--hoverable">
                {rows.map((r, rIndex) => (
                    <tbody key={rIndex}>
                    {columns.map((c, cIndex) => (
                        <tr key={`${rIndex}_${cIndex}`}>
                            <th>{c.name}</th>
                            <td>{r[c.key]}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="2">
                            <ListingActions/>
                        </td>
                    </tr>
                    </tbody>
                ))}
            </table>

            <div className="listing__footer">
                <Link className="button button--success button--wide hoverable" to="/guests">
                    Register new guest
                </Link>
            </div>
        </div>
    </React.Fragment>
);

ListingCompact.propTypes = {
    rows: PropTypes.array,
    columns: PropTypes.array,
}

export default ListingCompact;