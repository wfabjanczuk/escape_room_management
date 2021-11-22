import React from "react";

export default class Header extends React.Component {
    render() {
        return <header>
            <h1><a className="hoverable" href="">Escape Room Management</a></h1>
            <a className="logo-link hoverable" href="">
                <img className="header-logo" src={'logo.png'} alt="Escape Room Management Logo"/>
            </a>
        </header>;
    }
}