import React from 'react';
import ListingActions from './ListingActions';
import * as PropTypes from 'prop-types';
import Footer from './Footer';

const ListingCompact = ({rows, columns, actionsRoute, buttonText, buttonUrl}) => (
    <div className='listing listing--compact'>
        <table className='listing__table listing__table--hoverable'>
            {rows.map((r, rIndex) => (
                <tbody key={rIndex}>
                {columns.map((c, cIndex) => (
                    <tr key={`${rIndex}_${cIndex}`}>
                        <th>{c.name}</th>
                        <td>{r[c.key]}</td>
                    </tr>
                ))}
                <tr>
                    <td colSpan='2'>
                        <ListingActions id={r.id} route={actionsRoute}/>
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
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
};

export default ListingCompact;