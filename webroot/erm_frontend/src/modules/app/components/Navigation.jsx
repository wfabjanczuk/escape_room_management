import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import ROUTES from '../constants/routes';

const Navigation = () => {
    const {pathname} = useLocation(),
        isActive = {
            home: ROUTES.home === pathname,
            guests: pathname.startsWith(ROUTES.guests.index),
            tickets: pathname.startsWith(ROUTES.tickets.index),
            reservations: pathname.startsWith(ROUTES.reservations.index),
            rooms: pathname.startsWith(ROUTES.rooms.index),
        };

    return <nav>
        <ul>
            <li>
                <Link className={`hoverable ${isActive.home ? 'active' : ''}`} to={ROUTES.home}>
                    Home
                </Link>
            </li>
            <li>
                <Link className={`hoverable ${isActive.guests ? 'active' : ''}`} to={ROUTES.guests.index}>
                    Guests
                </Link>
            </li>
            <li>
                <Link className={`hoverable ${isActive.tickets ? 'active' : ''}`} to={ROUTES.tickets.index}>
                    Tickets
                </Link>
            </li>
            <li>
                <Link className={`hoverable ${isActive.reservations ? 'active' : ''}`} to={ROUTES.reservations.index}>
                    Reservations
                </Link>
            </li>
            <li>
                <Link className={`hoverable ${isActive.rooms ? 'active' : ''}`} to={ROUTES.rooms.index}>
                    Rooms
                </Link>
            </li>
        </ul>
    </nav>;
};

export default Navigation;