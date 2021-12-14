import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import Footer from './modules/app/components/Footer';
import Header from './modules/app/components/Header';
import Navigation from './modules/app/components/Navigation';
import FlashMessenger from './modules/app/components/flash/FlashMessenger';
import AppRoutes from './modules/app/components/AppRoutes';

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
