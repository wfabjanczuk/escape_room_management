import {Link} from 'react-router-dom';
import ROUTES from '../constants/routes';
import React from 'react';

const NotFound = () => (
    <div className='statement'>
        <p>Page not found.</p>
        <div className='statement__footer'>
            <Link className='button button--primary button--wide hoverable' to={ROUTES.home}>
                Return to home page
            </Link>
        </div>
    </div>
);

export default NotFound;