import {get as _get} from 'lodash';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Footer from '../../app/components/form/Footer';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import getDeleteTicketPromise from '../utils/getDeleteTicketPromise';
import NewFormValidator from '../../app/utils/FormValidator';
import {sendData} from '../../app/utils/form';
import * as PropTypes from 'prop-types';
import {addSuccessMessage} from '../../redux/flash/flashActions';
import {connect} from 'react-redux';
import TicketFormFields from './TicketFormFields';
import axios from 'axios';
import {increaseChangeCounter} from '../../redux/change/changeActions';

const getInitialFormData = (ticket) => {
    return {
        id: ticket ? ticket.id : '',
        reservationId: ticket ? ticket.reservationId.toString() : '',
        guestId: ticket ? ticket.guestId.toString() : '',
        price: ticket ? parseFloat(ticket.price).toFixed(2) : '0.00',
        guestAllowedToCancel: ticket ? !!ticket.guestAllowedToCancel : false,
    };
};

const getUrls = (ticket, entityExists, isDisabled) => {
    const apiUrl = entityExists
            ? getRouteWithParams(ROUTES.api.ticket, {id: ticket.id})
            : ROUTES.api.tickets,
        cancelUrl = entityExists
            ? getRouteWithParams(ROUTES.tickets.details, {id: ticket.id})
            : ROUTES.tickets.index,
        editUrl = entityExists
            ? getRouteWithParams(ROUTES.tickets.edit, {id: ticket.id})
            : '',
        redirectUrl = isDisabled
            ? ROUTES.tickets.index
            : cancelUrl;

    return {
        api: apiUrl,
        edit: editUrl,
        redirect: redirectUrl,
    }
};

const validateFormData = (formData, setErrors) => {
    const formValidator = NewFormValidator(formData);

    formValidator.required(['reservationId', 'guestId', 'price']);
    formValidator.isDigits(['reservationId', 'guestId'], false);
    formValidator.isMoney(['price'], false);

    if (!formValidator.isValid()) {
        setErrors(formValidator.errors);
        return false;
    }

    return true;
};

const TicketForm = ({ticket, isDisabled, addSuccessMessage, changeCounter, increaseChangeCounter}) => {
    const id = parseInt(_get(ticket, 'id', null), 10),
        entityExists = !!ticket,
        urls = getUrls(ticket, entityExists, isDisabled),
        [formData, setFormData] = useState(getInitialFormData(ticket)),
        [errors, setErrors] = useState({}),
        [reservationOptions, setReservationOptions] = useState({
            reservations: [],
            isLoading: true,
            errors: [],
        }),
        [guestOptions, setGuestOptions] = useState({
            guests: [],
            isLoading: true,
            errors: [],
        }),
        navigate = useNavigate(),
        onValueChange = (event) => {
            setFormData(formData => ({
                ...formData,
                [event.target.name]: event.target.value,
            }))
        },
        forceValueChange = (field, value) => {
            setFormData(formData => ({
                ...formData,
                [field]: value,
            }))
        },
        handleSubmit = (event) => {
            event.preventDefault();
            const submittedFormData = Object.fromEntries(new FormData(event.target));

            if (validateFormData(submittedFormData, setErrors)) {
                sendData(submittedFormData, urls.api, urls.redirect, entityExists, setErrors, addSuccessMessage, navigate, 'Ticket');
            }

            increaseChangeCounter();
        };

    useEffect(() => {
            const mapReservationToOption = (r) => ({id: r.id, label: r.room.name});

            if (isDisabled) {
                setReservationOptions({
                    reservations: [mapReservationToOption(ticket.reservation)],
                    isLoading: false,
                    errors: [],
                });
                return;
            }

            axios.get(ROUTES.api.reservations)
                .then(
                    (response) => setReservationOptions({
                        ...reservationOptions,
                        reservations: response.data.reservations.map(mapReservationToOption),
                        isLoading: false,
                    }),
                    (error) => setReservationOptions({
                        ...reservationOptions,
                        isLoading: false,
                        errors: [...reservationOptions.errors, error],
                    })
                );
        },
        [changeCounter]
    );

    useEffect(() => {
            const mapGuestToOption = (g) => ({id: g.id, label: `${g.firstName} ${g.lastName}`});

            if (isDisabled) {
                setGuestOptions({
                    guests: [mapGuestToOption(ticket.guest)],
                    isLoading: false,
                    errors: [],
                });
                return;
            }

            axios.get(ROUTES.api.guests)
                .then(
                    (response) => setGuestOptions({
                        ...guestOptions,
                        guests: response.data.guests.map(mapGuestToOption),
                        isLoading: false,
                    }),
                    (error) => setGuestOptions({
                        ...guestOptions,
                        isLoading: false,
                        errors: [...guestOptions.errors, error],
                    })
                );
        },
        [changeCounter]
    );

    if (!isDisabled && (reservationOptions.isLoading || guestOptions.isLoading)) {
        return <p>Loading...</p>;
    }

    if (reservationOptions.errors.length || guestOptions.errors.length) {
        return <React.Fragment>
            {[...reservationOptions.errors, ...guestOptions.errors].map(
                (e, eIndex) => <p key={eIndex}>{e.message}</p>
            )}
        </React.Fragment>;
    }

    return <form className='form' method='POST' onSubmit={handleSubmit}>
        <TicketFormFields entityExists={entityExists}
                          reservationOptions={reservationOptions.reservations} guestOptions={guestOptions.guests}
                          isDisabled={isDisabled} onValueChange={onValueChange} forceValueChange={forceValueChange}
                          formData={formData} errors={errors}/>
        <Footer id={id} entityExists={entityExists}
                isDisabled={isDisabled} getDeletePromise={getDeleteTicketPromise}
                editUrl={urls.edit} redirectUrl={urls.redirect} error={errors.general}/>
    </form>;
}

TicketForm.propTypes = {
    ticket: PropTypes.object,
    isDisabled: PropTypes.bool,
    addSuccessMessage: PropTypes.func,
    changeCounter: PropTypes.number,
    increaseChangeCounter: PropTypes.func,
};

const mapStateToProps = (state) => ({
    changeCounter: state.change.counter,
});

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
    increaseChangeCounter: () => dispatch(increaseChangeCounter()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketForm);
