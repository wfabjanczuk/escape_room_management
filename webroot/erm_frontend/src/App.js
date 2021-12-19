import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import Footer from './modules/app/components/Footer';
import Header from './modules/app/components/Header';
import Navigation from './modules/app/components/Navigation';
import FlashMessenger from './modules/app/components/flash/FlashMessenger';
import AppRoutes from './modules/app/components/AppRoutes';
import i18n from "i18next";
import {initReactI18next} from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "home": "Home",
                    "welcome": "ERM is designed for management of escape room reservations. The system allows to browse and edit guests, their tickets, reservations and available rooms.",
                    "guest_one": "Guest",
                    "guest_other": "Guests",
                    "ticket_one": "Ticket",
                    "ticket_other": "Tickets",
                    "reservation_one": "Reservation",
                    "reservation_other": "Reservations",
                    "room_one": "Room",
                    "room_other": "Rooms",
                }
            },
            pl: {
                translation: {
                    "home": "Strona główna",
                    "welcome": "ERM to narzędzie do zarządzania rezerwacjami escape roomów. System umożliwia przeglądanie i edycję gości, ich biletów, rezerwacji oraz dostępnych pokoi.",
                    "guest_one": "Gość",
                    "guest_many": "Goście",
                    "ticket_one": "Bilet",
                    "ticket_many": "Bilety",
                    "reservation_one": "Rezerwacja",
                    "reservation_many": "Rezerwacje",
                    "room_one": "Pokój",
                    "room_many": "Pokoje",
                }
            }
        },
        lng: "pl",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        }
    });


export default function App() {
    return <BrowserRouter>
        <Header/>
        <Navigation/>
        <main>
            <FlashMessenger/>
            <AppRoutes/>
        </main>
        <Footer/>
    </BrowserRouter>;
}
