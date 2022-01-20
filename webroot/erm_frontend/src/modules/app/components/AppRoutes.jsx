import React from 'react';
import {Route, Routes} from 'react-router-dom';
import ROUTES from '../constants/routes';
import Home from '../views/Home';
import Guests from '../../guests/views/Guests';
import GuestAdd from '../../guests/views/GuestAdd';
import GuestDetails from '../../guests/views/GuestDetails';
import GuestEdit from '../../guests/views/GuestEdit';
import Tickets from '../../tickets/views/Tickets';
import Reservations from '../../reservations/views/Reservations';
import Rooms from '../../rooms/views/Rooms';
import TicketDetails from '../../tickets/views/TicketDetails';
import TicketAdd from '../../tickets/views/TicketAdd';
import TicketEdit from '../../tickets/views/TicketEdit';
import ReservationAdd from '../../reservations/views/ReservationAdd';
import ReservationEdit from '../../reservations/views/ReservationEdit';
import ReservationDetails from '../../reservations/views/ReservationDetails';
import RoomAdd from '../../rooms/views/RoomAdd';
import RoomEdit from '../../rooms/views/RoomEdit';
import RoomDetails from '../../rooms/views/RoomDetails';
import SignIn from '../../users/views/SignIn';
import SignUp from '../../users/views/SignUp';
import ProfileDetails from '../../users/views/ProfileDetails';
import ProfileEdit from '../../users/views/ProfileEdit';

const AppRoutes = () => (<Routes>
    <Route path={ROUTES.home} element={<Home/>}/>
    {getAuthenticationRoutes()}
    {getGuestRoutes()}
    {getTicketRoutes()}
    {getReservationRoutes()}
    {getRoomRoutes()}
</Routes>);

export default AppRoutes;

const getAuthenticationRoutes = () => (<React.Fragment>
    <Route path={ROUTES.users.signIn} element={<SignIn/>}/>
    <Route path={ROUTES.users.signUp} element={<SignUp/>}/>
    <Route path={ROUTES.users.profileDetails} element={<ProfileDetails/>}/>
    <Route path={ROUTES.users.profileEdit} element={<ProfileEdit/>}/>
</React.Fragment>);

const getGuestRoutes = () => (<React.Fragment>
    <Route path={ROUTES.guests.index} element={<Guests/>}/>
    <Route path={ROUTES.guests.add} element={<GuestAdd/>}/>
    <Route path={ROUTES.guests.edit} element={<GuestEdit/>}/>
    <Route path={ROUTES.guests.details} element={<GuestDetails/>}/>
</React.Fragment>);

const getTicketRoutes = () => (<React.Fragment>
    <Route path={ROUTES.tickets.index} element={<Tickets/>}/>
    <Route path={ROUTES.tickets.add} element={<TicketAdd/>}/>
    <Route path={ROUTES.tickets.edit} element={<TicketEdit/>}/>
    <Route path={ROUTES.tickets.details} element={<TicketDetails/>}/>
</React.Fragment>);

const getReservationRoutes = () => (<React.Fragment>
    <Route path={ROUTES.reservations.index} element={<Reservations/>}/>
    <Route path={ROUTES.reservations.add} element={<ReservationAdd/>}/>
    <Route path={ROUTES.reservations.edit} element={<ReservationEdit/>}/>
    <Route path={ROUTES.reservations.details} element={<ReservationDetails/>}/>
</React.Fragment>);

const getRoomRoutes = () => (<React.Fragment>
    <Route path={ROUTES.rooms.index} element={<Rooms/>}/>
    <Route path={ROUTES.rooms.add} element={<RoomAdd/>}/>
    <Route path={ROUTES.rooms.edit} element={<RoomEdit/>}/>
    <Route path={ROUTES.rooms.details} element={<RoomDetails/>}/>
</React.Fragment>);
