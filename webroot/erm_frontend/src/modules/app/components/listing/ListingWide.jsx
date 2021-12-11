import React from 'react';
import ListingActions from './ListingActions';
import * as PropTypes from 'prop-types';
import Footer from './Footer';

const ListingWide = ({rows, columns, actionsRoute, actionsApiEndpoint, buttonText, buttonUrl}) => (
    <div className='listing listing--wide'>
        <table className='listing__table listing__table--hoverable'>
            <thead>
            <tr>
                {columns.map((c, cIndex) => (
                    <th key={cIndex} className={c.isExtra ? 'extra-column' : ''}>
                        {c.name}
                    </th>
                ))}
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {rows.map((r, rIndex) => (
                <tr key={rIndex}>
                    {columns.map((c, cIndex) => (
                        <td key={`${rIndex}_${cIndex}`}
                            className={(c.isExtra ? 'extra-column ' : '') + ('id' === c.key ? 'id-column ' : '')}
                        >
                            {c.render ? c.render(r) : r[c.key]}
                        </td>
                    ))}
                    <td>
                        <ListingActions id={r.id} route={actionsRoute} apiEndpoint={actionsApiEndpoint}/>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>

        <Footer buttonText={buttonText} buttonUrl={buttonUrl}/>
    </div>
);

ListingWide.propTypes = {
    rows: PropTypes.array,
    columns: PropTypes.array,
    actionsRoute: PropTypes.object,
    actionsApiEndpoint: PropTypes.string,
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
};

export default ListingWide;