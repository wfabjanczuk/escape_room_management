import ROUTES from '../constants/routes';
import {ROLE_GUEST} from '../constants/roles';

const getUnauthenticatedNavigationLinks = (pathname) => [
    {
        isActive: ROUTES.home === pathname,
        route: ROUTES.home,
        label: 'Home',
    },
    {
        isActive: pathname.startsWith(ROUTES.rooms.index),
        route: ROUTES.rooms.index,
        label: 'Rooms',
    }
];

const getGuestNavigationLinks = (pathname) => [
    {
        isActive: ROUTES.home === pathname,
        route: ROUTES.home,
        label: 'Home',
    },
    {
        isActive: pathname.startsWith(ROUTES.reservations.index),
        route: ROUTES.reservations.index,
        label: 'Reservations',
    },
    {
        isActive: pathname.startsWith(ROUTES.rooms.index),
        route: ROUTES.rooms.index,
        label: 'Rooms',
    },
    {
        isActive: pathname.startsWith(ROUTES.reviews.index),
        route: ROUTES.reviews.index,
        label: 'Reviews',
    },
];

const getAdminNavigationLinks = (pathname) => [
    {
        isActive: ROUTES.home === pathname,
        route: ROUTES.home,
        label: 'Home',
    },
    {
        isActive: pathname.startsWith(ROUTES.guests.index),
        route: ROUTES.guests.index,
        label: 'Guests',
    },
    {
        isActive: pathname.startsWith(ROUTES.tickets.index),
        route: ROUTES.tickets.index,
        label: 'Tickets',
    },
    {
        isActive: pathname.startsWith(ROUTES.reservations.index),
        route: ROUTES.reservations.index,
        label: 'Reservations',
    },
    {
        isActive: pathname.startsWith(ROUTES.rooms.index),
        route: ROUTES.rooms.index,
        label: 'Rooms',
    },
    {
        isActive: pathname.startsWith(ROUTES.reviews.index),
        route: ROUTES.reviews.index,
        label: 'Reviews',
    },
    {
        isActive: pathname.startsWith(ROUTES.users.index),
        route: ROUTES.users.index,
        label: 'Users',
    }
];

const getNavigationLinks = (profile, pathname) => {
    if (!profile) {
        return getUnauthenticatedNavigationLinks(pathname);
    }

    if (profile.roleId === ROLE_GUEST) {
        return getGuestNavigationLinks(pathname);
    }

    return getAdminNavigationLinks(pathname);
};

export default getNavigationLinks;