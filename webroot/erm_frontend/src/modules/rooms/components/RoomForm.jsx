import {get as _get} from 'lodash';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Footer from '../../app/components/form/Footer';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import getDeleteRoomPromise from '../utils/getDeleteRoomPromise';
import NewFormValidator from '../../app/utils/FormValidator';
import * as PropTypes from 'prop-types';
import {addSuccessMessage} from '../../redux/flash/flashActions';
import {connect} from 'react-redux';
import RoomFormFields from './RoomFormFields';
import {sendData} from '../../app/utils/form';

const getInitialFormData = (room) => {
    return {
        id: room ? room.id : '',
        name: room ? room.name : '',
        baseTicketPrice: room ? parseFloat(room.baseTicketPrice).toFixed(2) : '0.00',
        minParticipants: room ? room.minParticipants : '',
        maxParticipants: room ? room.maxParticipants : '',
        minAge: room ? room.minAge : '',
    };
};

const getUrls = (room, entityExists, isDisabled) => {
    const apiUrl = entityExists
            ? getRouteWithParams(ROUTES.api.room, {id: room.id})
            : ROUTES.api.rooms,
        cancelUrl = entityExists
            ? getRouteWithParams(ROUTES.rooms.details, {id: room.id})
            : ROUTES.rooms.index,
        editUrl = entityExists
            ? getRouteWithParams(ROUTES.rooms.edit, {id: room.id})
            : '',
        redirectUrl = isDisabled
            ? ROUTES.rooms.index
            : cancelUrl;

    return {
        api: apiUrl,
        edit: editUrl,
        redirect: redirectUrl,
    }
};

const validateFormData = (formData, setErrors) => {
    const formValidator = NewFormValidator(formData);

    formValidator.required(['name', 'baseTicketPrice', 'minParticipants', 'maxParticipants']);
    formValidator.maxLength(['name'], 100);
    formValidator.isDigits(['minParticipants', 'maxParticipants'], false);
    formValidator.isDigits(['minAge'], true);
    formValidator.intPositive(['minParticipants', 'maxParticipants', 'minAge']);
    formValidator.isMoney(['baseTicketPrice'], false);

    if (formValidator.isValid()) {
        const minParticipants = parseInt(formData.minParticipants, 10),
            maxParticipants = parseInt(formData.maxParticipants, 10);

        if (maxParticipants < minParticipants) {
            formValidator.putError('maxParticipants',
                '"Max. participants" must be greater or equal to "min. participants".');
        }
    }

    if (!formValidator.isValid()) {
        setErrors(formValidator.errors);
        return false;
    }

    return true;
};

const RoomForm = ({room, isDisabled, addSuccessMessage}) => {
    const id = parseInt(_get(room, 'id', null), 10),
        entityExists = !!room,
        urls = getUrls(room, entityExists, isDisabled),
        [formData, setFormData] = useState(getInitialFormData(room)),
        [errors, setErrors] = useState({}),
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
                sendData(submittedFormData, urls.api, urls.redirect, entityExists, setErrors, addSuccessMessage, navigate, 'Room');
            }
        };

    return <form className='form' method='POST' onSubmit={handleSubmit}>
        <RoomFormFields entityExists={entityExists} isDisabled={isDisabled}
                        onValueChange={onValueChange} forceValueChange={forceValueChange}
                        formData={formData} errors={errors}/>
        <Footer id={id} entityExists={entityExists}
                isDisabled={isDisabled} getDeletePromise={getDeleteRoomPromise}
                editUrl={urls.edit} redirectUrl={urls.redirect} error={errors.general}/>
    </form>;
}

RoomForm.propTypes = {
    room: PropTypes.object,
    isDisabled: PropTypes.bool,
    addSuccessMessage: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
});

export default connect(null, mapDispatchToProps)(RoomForm);
