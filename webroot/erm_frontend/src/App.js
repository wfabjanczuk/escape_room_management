import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Footer from './modules/app/components/Footer';
import Header from './modules/app/components/Header';
import Navigation from './modules/app/components/Navigation';
import Reservations from './modules/reservations/views/Reservations';
import Guests from './modules/guests/views/Guests';
import GuestAdd from './modules/guests/views/GuestAdd';
import GuestDetails from './modules/guests/views/GuestDetails';
import GuestEdit from './modules/guests/views/GuestEdit';
import Tickets from './modules/tickets/views/Tickets';
import Rooms from './modules/rooms/views/Rooms';
import Home from './modules/app/views/Home';
import ROUTES from './modules/app/constants/routes';
import FlashMessenger from "./modules/app/components/flash/FlashMessenger";

export default function App() {
    return <BrowserRouter>
        <Header/>
        <Navigation/>
        <main>
            <FlashMessenger/>
            <Routes>
                <Route path={ROUTES.home} element={<Home/>}/>
                <Route path={ROUTES.guests.index} element={<Guests/>}/>
                <Route path={ROUTES.guests.add} element={<GuestAdd/>}/>
                <Route path={ROUTES.guests.details} element={<GuestDetails/>}/>
                <Route path={ROUTES.guests.edit} element={<GuestEdit/>}/>
                <Route path={ROUTES.tickets.index} element={<Tickets/>}/>
                <Route path={ROUTES.reservations.index} element={<Reservations/>}/>
                <Route path={ROUTES.rooms.index} element={<Rooms/>}/>
            </Routes>
        </main>
        <Footer/>
    </BrowserRouter>;
}
