import React from 'react';
import {Link} from 'react-router-dom';
import ListingActions from './ListingActions';
import * as PropTypes from 'prop-types';

const ListingWide = ({rows, columns, actionsRoute}) => (
    <React.Fragment>
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
                            <td key={`${rIndex}_${cIndex}`} className={c.isExtra ? 'extra-column' : ''}>
                                {r[c.key]}
                            </td>
                        ))}
                        <td>
                            <ListingActions id={r.id} route={actionsRoute}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className='listing__footer'>
                <Link className='button button--success button--wide hoverable' to='/guests'>
                    Register new guest
                </Link>
            </div>
        </div>
    </React.Fragment>
);

ListingWide.propTypes = {
    rows: PropTypes.array,
    columns: PropTypes.array,
    actionsRoute: PropTypes.string,
};

export default ListingWide;