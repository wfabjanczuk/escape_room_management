import React from 'react';
import ListingActions from './ListingActions';
import * as PropTypes from 'prop-types';
import Footer from './Footer';

const ListingCompact = (
    {
        rows,
        columns,
        actionsRoute,
        getDeletePromise,
        buttonText,
        buttonUrl,
        renderActions,
        actionsRenderer,
    }
) => (
    <div className='listing listing--compact'>
        <table className='listing__table listing__table--hoverable'>
            {rows.map((r, rIndex) => (
                <tbody key={rIndex}>
                {columns.map((c, cIndex) => (
                    <tr key={`${rIndex}_${cIndex}`} className={r.cancelled ? 'cancelled' : ''}>
                        <th>{c.name}</th>
                        <td>{c.render ? c.render(r) : r[c.key]}</td>
                    </tr>
                ))}
                {renderActions &&
                    <tr>
                        <td colSpan='2'>
                            <ListingActions
                                row={r}
                                route={actionsRoute}
                                getDeletePromise={getDeletePromise}
                                actionsRenderer={actionsRenderer}
                                renderActions={renderActions}
                            />
                        </td>
                    </tr>
                }
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
    getDeletePromise: PropTypes.func,
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
    renderActions: PropTypes.bool,
    actionsRenderer: PropTypes.func,
};

export default ListingCompact;