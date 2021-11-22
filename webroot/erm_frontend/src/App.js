import React from "react";
import Footer from "./modules/app/component/Footer";
import Header from "./modules/app/component/Header";
import Navigation from "./modules/app/component/Navigation";

class App extends React.Component {
    render() {
        return <React.Fragment>
            <Header/>
            <Navigation/>
            <main>
                <h2>Home</h2>
                <p>
                    ERM is designed for management of escape room reservations.
                    The system allows to browse and edit guests, their tickets, reservations and available rooms.
                </p>
            </main>
            <Footer/>
        </React.Fragment>;
    }
}

export default App;