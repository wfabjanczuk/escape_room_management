import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import ROUTES from '../constants/routes';
import {useTranslation} from "react-i18next";

const Navigation = () => {
    const {t} = useTranslation();

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
                    {t('home')}
                </Link>
            </li>
            <li>
                <Link className={`hoverable ${isActive.guests ? 'active' : ''}`} to={ROUTES.guests.index}>
                    {t('guest', {count: 0})}
                </Link>
            </li>
            <li>
                <Link className={`hoverable ${isActive.tickets ? 'active' : ''}`} to={ROUTES.tickets.index}>
                    {t('ticket', {count: 0})}
                </Link>
            </li>
            <li>
                <Link className={`hoverable ${isActive.reservations ? 'active' : ''}`} to={ROUTES.reservations.index}>
                    {t('reservation', {count: 0})}
                </Link>
            </li>
            <li>
                <Link className={`hoverable ${isActive.rooms ? 'active' : ''}`} to={ROUTES.rooms.index}>
                    {t('room', {count: 0})}
                </Link>
            </li>
        </ul>
    </nav>;
};

export default Navigation;