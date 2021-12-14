import {get as _get} from 'lodash';
import React, {useState} from 'react';
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

const getInitialFormData = (ticket) => {
    return ticket ? ticket : {
        price: '',
        reservationId: '',
        guestId: '',
        guestIsAllowedToCancel: '',
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

    if (!formValidator.isValid()) {
        setErrors(formValidator.errors);
        return false;
    }

    return true;
};

const TicketForm = ({ticket, isDisabled, addSuccessMessage}) => {
    const id = parseInt(_get(ticket, 'id', null), 10),
        entityExists = !!ticket,
        urls = getUrls(ticket, entityExists, isDisabled),
        [formData, setFormData] = useState(getInitialFormData(ticket)),
        [errors, setErrors] = useState({}),
        navigate = useNavigate(),
        onValueChange = (event) => {
            setFormData(formData => ({
                ...formData,
                [event.target.name]: event.target.value,
            }))
        },
        handleSubmit = (event) => {
            event.preventDefault();
            const submittedFormData = Object.fromEntries(new FormData(event.target));

            if (validateFormData(submittedFormData, setErrors)) {
                sendData(submittedFormData, urls.api, urls.redirect, entityExists, setErrors, addSuccessMessage, navigate, 'Ticket');
            }
        };

    return <form className='form' method='POST' onSubmit={handleSubmit}>
        <TicketFormFields entityExists={entityExists} isDisabled={isDisabled} onValueChange={onValueChange}
                          formData={formData} errors={errors}/>
        <Footer id={id} entityExists={entityExists}
                isDisabled={isDisabled} getDeletePromise={getDeleteTicketPromise}
                editUrl={urls.edit} redirectUrl={urls.redirect} error={errors.general}/>
    </form>;
}

TicketForm.propTypes = {
    guest: PropTypes.object,
    isDisabled: PropTypes.bool,
    addSuccessMessage: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
});

export default connect(null, mapDispatchToProps)(TicketForm);
