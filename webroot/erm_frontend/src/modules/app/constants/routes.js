const API = 'http://localhost:9000/v1';

export const getRouteWithParams = (route, params) => {
    let routeWithParams = route;

    for (const param in params) {
        routeWithParams = routeWithParams.replaceAll(`:${param}`, params[param]);
    }

    return routeWithParams;
};

const ROUTES = {
    api: {
        guests: API + '/guests',
        guest: API + '/guests/:id',
        guestTickets: API + '/guests/:id/tickets',
        tickets: API + '/tickets',
        ticket: API + '/tickets/:id',
        reservations: API + '/reservations',
        reservation: API + '/reservations/:id',
        reservationTickets: API + '/reservations/:id/tickets',
        cancelReservation: API + '/reservations/:id/cancel',
        rooms: API + '/rooms',
        room: API + '/rooms/:id',
        roomReservations: API + '/rooms/:id/reservations',
        signIn: API + '/signin',
        signUp: API + '/guests/signup',
        users: API + '/users',
        user: API + '/users/:id',
        userGuest: API + '/users/:id/guest',
    },
    home: '/',
    users: {
        signIn: '/signin',
        signUp: '/signup',
        profileDetails: '/profile/details',
        profileEdit: '/profile/edit',
        index: '/users',
        add: '/users/add',
        details: '/users/:id/details',
        edit: '/users/:id/edit',
    },
    guests: {
        index: '/guests',
        add: '/guests/add',
        details: '/guests/:id/details',
        edit: '/guests/:id/edit',
    },
    tickets: {
        index: '/tickets',
        add: '/tickets/add',
        details: '/tickets/:id/details',
        edit: '/tickets/:id/edit',
    },
    reservations: {
        index: '/reservations',
        add: '/reservations/add',
        details: '/reservations/:id/details',
        edit: '/reservations/:id/edit',
    },
    rooms: {
        index: '/rooms',
        add: '/rooms/add',
        details: '/rooms/:id/details',
        edit: '/rooms/:id/edit',
    }
};

export default ROUTES;