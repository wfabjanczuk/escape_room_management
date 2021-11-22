import React from "react";

export default class Navigation extends React.Component {
    render() {
        return <nav>
            <ul>
                <li><a className="hoverable active" href="">Home</a></li>
                <li><a className="hoverable" href="">Guests</a></li>
                <li><a className="hoverable" href="">Tickets</a></li>
                <li><a className="hoverable" href="">Reservations</a></li>
                <li><a className="hoverable" href="">Rooms</a></li>
            </ul>
        </nav>;
    }
}