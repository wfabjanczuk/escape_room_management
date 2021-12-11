import React from 'react';
import ListingActions from './ListingActions';
import * as PropTypes from 'prop-types';
import Footer from './Footer';

const ListingCompact = ({rows, columns, actionsRoute, actionsApiEndpoint, buttonText, buttonUrl}) => (
    <div className='listing listing--compact'>
        <table className='listing__table listing__table--hoverable'>
            {rows.map((r, rIndex) => (
                <tbody key={rIndex}>
                {columns.map((c, cIndex) => (
                    <tr key={`${rIndex}_${cIndex}`}>
                        <th>{c.name}</th>
                        <td>{c.render ? c.render(r) : r[c.key]}</td>
                    </tr>
                ))}
                <tr>
                    <td colSpan='2'>
                        <ListingActions id={r.id} route={actionsRoute} apiEndpoint={actionsApiEndpoint}/>
                    </td>
                </tr>
                </tbody>
            ))}
        </table>

        <Footer buttonText={buttonText} buttonUrl={buttonUrl}/>
    </div>
);

ListingCompact.propTypes = {
    rows: PropTypes.array,
    columns: PropTypes.array,
    actionsRoute: PropTypes.object,
    actionsApiEndpoint: PropTypes.string,
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
};

export default ListingCompact;