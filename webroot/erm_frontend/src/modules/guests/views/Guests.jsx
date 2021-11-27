import React from 'react';
import Listing from "../../app/components/listing/Listing";

const guestColumns = [
    {key: 'first_name', name: 'First name', isExtra: false},
    {key: 'last_name', name: 'Last name', isExtra: false},
    {key: 'email', name: 'Email', isExtra: true},
];

export default class Guests extends React.Component {
    state = {
        guests: [],
        isLoading: true,
    };

    componentDidMount() {
        fetch('http://localhost:9000/v1/guests/')
            .then((response) => response.json())
            .then((json) => this.setState({
                guests: json.guests,
                isLoading: false,
            }));
    }

    render() {
        const {guests, isLoading} = this.state;

        return <Listing
            title={'Guest list'}
            isLoading={isLoading}
            rows={guests}
            columns={guestColumns}
        />;
    }
};