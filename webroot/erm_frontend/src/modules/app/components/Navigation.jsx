import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import ROUTES from '../constants/routes';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';

const Navigation = ({currentUser}) => {
    const {pathname} = useLocation(),
        isActive = {
            home: ROUTES.home === pathname,
            guests: pathname.startsWith(ROUTES.guests.index),
            tickets: pathname.startsWith(ROUTES.tickets.index),
            reservations: pathname.startsWith(ROUTES.reservations.index),
            rooms: pathname.startsWith(ROUTES.rooms.index),
            users: pathname.startsWith(ROUTES.users.index),
        };

    return <nav>
        <ul>
            <li>
                <Link className={`hoverable ${isActive.home ? 'active' : ''}`} to={ROUTES.home}>
                    Home
                </Link>
            </li>

            {currentUser &&
                <React.Fragment>
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
                        <Link className={`hoverable ${isActive.reservations ? 'active' : ''}`}
                              to={ROUTES.reservations.index}>
                            Reservations
                        </Link>
                    </li>
                </React.Fragment>
            }

            <li>
                <Link className={`hoverable ${isActive.rooms ? 'active' : ''}`} to={ROUTES.rooms.index}>
                    Rooms
                </Link>
            </li>

            {currentUser &&
                <li>
                    <Link className={`hoverable ${isActive.users ? 'active' : ''}`} to={ROUTES.users.index}>
                        Users
                    </Link>
                </li>
            }
        </ul>
    </nav>;
};

Navigation.propTypes = {
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(Navigation);