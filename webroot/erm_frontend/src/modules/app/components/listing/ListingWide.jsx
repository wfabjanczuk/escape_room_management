import React from 'react';
import ListingActions from './ListingActions';
import * as PropTypes from 'prop-types';
import Footer from './Footer';

const ListingWide = (
    {
        rows,
        columns,
        actionsRoute,
        getDeletePromise,
        buttonText,
        buttonUrl,
        renderActions,
        actionsRenderer
    }
) => (
    <div className='listing listing--wide'>
        <table className='listing__table listing__table--hoverable'>
            <thead>
            <tr>
                {columns.map((c, cIndex) => (
                    <th key={cIndex} className={c.isExtra ? 'extra-column' : ''}>
                        {c.name}
                    </th>
                ))}
                {renderActions && <th>Actions</th>}
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
                    {renderActions &&
                        <td>
                            <ListingActions
                                row={r}
                                route={actionsRoute}
                                getDeletePromise={getDeletePromise}
                                actionsRenderer={actionsRenderer}
                                renderActions={renderActions}
                            />
                        </td>
                    }
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
    getDeletePromise: PropTypes.func,
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
    renderActions: PropTypes.bool,
    actionsRenderer: PropTypes.func,
};

export default ListingWide;