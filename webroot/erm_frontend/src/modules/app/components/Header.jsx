import React from "react";
import {Link} from "react-router-dom";

export default class Header extends React.Component {
    render() {
        return <header>
            <h1><Link className="hoverable" to="/">Escape Room Management</Link></h1>
            <Link className="logo-link hoverable" to="/">
                <img className="header-logo" src={'logo.png'} alt="Escape Room Management Logo"/>
            </Link>
        </header>;
    }
}