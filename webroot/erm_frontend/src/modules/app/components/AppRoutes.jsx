import React from 'react';
import {Route, Routes} from "react-router-dom";
import ROUTES from "../constants/routes";
import Home from "../views/Home";
import Guests from "../../guests/views/Guests";
import GuestAdd from "../../guests/views/GuestAdd";
import GuestDetails from "../../guests/views/GuestDetails";
import GuestEdit from "../../guests/views/GuestEdit";
import Tickets from "../../tickets/views/Tickets";
import Reservations from "../../reservations/views/Reservations";
import Rooms from "../../rooms/views/Rooms";

const AppRoutes = () => (<Routes>
    <Route path={ROUTES.home} element={<Home/>}/>
    {getGuestRoutes()}
    {getTicketRoutes()}
    {getReservationRoutes()}
    {getRoomRoutes()}
</Routes>);

export default AppRoutes;

const getGuestRoutes = () => (<React.Fragment>
    <Route path={ROUTES.guests.index} element={<Guests/>}/>
    <Route path={ROUTES.guests.add} element={<GuestAdd/>}/>
    <Route path={ROUTES.guests.details} element={<GuestDetails/>}/>
    <Route path={ROUTES.guests.edit} element={<GuestEdit/>}/>
</React.Fragment>);

const getTicketRoutes = () => (<React.Fragment>
    <Route path={ROUTES.tickets.index} element={<Tickets/>}/>
</React.Fragment>);

const getReservationRoutes = () => (<React.Fragment>
    <Route path={ROUTES.reservations.index} element={<Reservations/>}/>
</React.Fragment>);

const getRoomRoutes = () => (<React.Fragment>
    <Route path={ROUTES.rooms.index} element={<Rooms/>}/>
</React.Fragment>);
