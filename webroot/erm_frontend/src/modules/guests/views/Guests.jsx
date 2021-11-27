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
        error: null,
    };

    componentDidMount() {
        fetch('http://localhost:9000/v1/guests/')
            .then((response) => {
                if (response.status !== 200) {
                    throw Error('Guests could not be fetched.');
                }

                return response.json();
            })
            .then(
                (json) => this.setState({
                    guests: json.guests,
                    isLoading: false,
                }),
                (error) => this.setState({
                    error: error,
                    isLoading: false,
                })
            );
    }

    render() {
        const {guests, isLoading, error} = this.state;

        return <Listing
            error={error}
            isLoading={isLoading}
            title={'Guest list'}
            rows={guests}
            columns={guestColumns}
        />;
    }
};