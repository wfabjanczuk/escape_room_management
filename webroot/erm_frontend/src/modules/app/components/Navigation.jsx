import React from "react";
import {Link} from "react-router-dom";

const Navigation = () => (<nav>
    <ul>
        <li><Link className="hoverable active" to="/">Home</Link></li>
        <li><Link className="hoverable" to="/guests">Guests</Link></li>
        <li><Link className="hoverable" to="/tickets">Tickets</Link></li>
        <li><Link className="hoverable" to="/reservations">Reservations</Link></li>
        <li><Link className="hoverable" to="/rooms">Rooms</Link></li>
    </ul>
</nav>);

export default Navigation;