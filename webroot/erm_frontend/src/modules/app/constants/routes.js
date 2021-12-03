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
    },
    home: '/',
    guests: {
        index: '/guests',
        add: '/guests/add',
        details: '/guests/:id/details',
        edit: '/guests/:id/edit',
        delete: '/guests/:id/delete',
    },
    tickets: {
        index: '/tickets',
    },
    reservations: {
        index: '/reservations',
    },
    rooms: {
        index: '/rooms',
    }
};

export default ROUTES;