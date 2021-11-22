import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Footer from "./modules/app/components/Footer";
import Header from "./modules/app/components/Header";
import Navigation from "./modules/app/components/Navigation";
import Reservations from "./modules/reservations/views/Reservations";
import Guests from "./modules/guests/views/Guests";
import Tickets from "./modules/tickets/views/Tickets";
import Rooms from "./modules/rooms/views/Rooms";
import Home from "./modules/app/views/Home";

export default function App() {
    return <Router>
        <Header/>
        <Navigation/>
        <main>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/guests" element={<Guests/>}/>
                <Route path="/tickets" element={<Tickets/>}/>
                <Route path="/reservations" element={<Reservations/>}/>
                <Route path="/rooms" element={<Rooms/>}/>
            </Routes>
        </main>
        <Footer/>
    </Router>;
}