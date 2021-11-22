import React from "react";

export default class Footer extends React.Component {
    render() {
        return <footer>
            <a className="hoverable" href="https://github.com/wfabjanczuk">
                Wojciech Fabjańczuk, s<span className="default-font">21471</span>
            </a>
        </footer>;
    }
}