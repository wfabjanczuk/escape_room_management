import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import getDeleteReservationPromise from '../utils/getDeleteReservationPromise';
import NewFormValidator from '../../app/utils/FormValidator';
import * as PropTypes from 'prop-types';
import {addSuccessMessage} from '../../app/redux/flash/flashActions';
import {connect} from 'react-redux';
import ReservationFormFields from './ReservationFormFields';
import axios from 'axios';
import {increaseChangeCounter} from '../../app/redux/change/changeActions';
import moment from 'moment';
import {API_DATE_FORMAT, INPUT_DATE_FORMAT} from '../../app/constants/dates';
import {sendData} from '../../app/utils/form';
import ReservationFormFooter from './ReservationFormFooter';

const getInitialFormData = (reservation) => {
    return {
        id: reservation ? reservation.id : '',
        roomId: reservation ? reservation.roomId.toString() : '',
        dateFrom: reservation ? moment(reservation.dateFrom, API_DATE_FORMAT).format(INPUT_DATE_FORMAT) : '',
        dateTo: reservation ? moment(reservation.dateTo, API_DATE_FORMAT).format(INPUT_DATE_FORMAT) : '',
        dateCancelled: reservation && reservation.dateCancelled
            ? moment(reservation.dateCancelled, API_DATE_FORMAT).format(INPUT_DATE_FORMAT)
            : '',
    };
};

const getUrls = (reservation, entityExists, isDisabled) => {
    const apiUrl = entityExists
            ? getRouteWithParams(ROUTES.api.reservation, {id: reservation.id})
            : ROUTES.api.reservations,
        cancelUrl = entityExists
            ? getRouteWithParams(ROUTES.reservations.details, {id: reservation.id})
            : ROUTES.reservations.index,
        editUrl = entityExists
            ? getRouteWithParams(ROUTES.reservations.edit, {id: reservation.id})
            : '',
        redirectUrl = isDisabled
            ? ROUTES.reservations.index
            : cancelUrl;

    return {
        api: apiUrl,
        edit: editUrl,
        redirect: redirectUrl,
    }
};

const validateFormData = (formData, setErrors) => {
    const formValidator = NewFormValidator(formData);

    formValidator.required(['roomId', 'dateFrom', 'dateTo']);
    formValidator.isDate(['dateFrom', 'dateTo'], false);
    formValidator.isDate(['dateCancelled'], true);

    if (formValidator.isValid()) {
        const dateFrom = moment(formData.dateFrom, API_DATE_FORMAT),
            dateTo = moment(formData.dateTo, API_DATE_FORMAT);

        if (!dateTo.isAfter(dateFrom)) {
            formValidator.putError('dateTo', '"Date to" must be after "date from".');
        }
    }

    if (!formValidator.isValid()) {
        setErrors(formValidator.errors);
        return false;
    }

    return true;
};

const ReservationForm = (
    {
        reservation,
        isDisabled,
        allowedToCancel,
        apiHeaders,
        addSuccessMessage,
        changeCounter,
        increaseChangeCounter,
    }
) => {
    const entityExists = !!reservation,
        urls = getUrls(reservation, entityExists, isDisabled),
        readOnlyValues = {
            totalPrice: reservation ? parseFloat(reservation.totalPrice).toFixed(2) : '',
        },
        [formData, setFormData] = useState(getInitialFormData(reservation)),
        [errors, setErrors] = useState({}),
        [roomOptions, setRoomOptions] = useState({
            rooms: [],
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
        handleSubmit = (event) => {
            event.preventDefault();
            const submittedFormData = Object.fromEntries(new FormData(event.target));

            submittedFormData.dateFrom = moment(submittedFormData.dateFrom, INPUT_DATE_FORMAT).format(API_DATE_FORMAT);
            submittedFormData.dateTo = moment(submittedFormData.dateTo, INPUT_DATE_FORMAT).format(API_DATE_FORMAT);
            submittedFormData.dateCancelled = submittedFormData.dateCancelled
                ? moment(submittedFormData.dateCancelled, INPUT_DATE_FORMAT).format(API_DATE_FORMAT)
                : '';

            if (validateFormData(submittedFormData, setErrors)) {
                sendData(submittedFormData, urls.api, urls.redirect, entityExists, apiHeaders, setErrors, addSuccessMessage, navigate, 'Reservation');
            }

            increaseChangeCounter();
        };

    useEffect(() => {
            const mapRoomToOption = (r) => ({id: r.id, label: r.name});

            if (isDisabled) {
                setRoomOptions({
                    rooms: [mapRoomToOption(reservation.room)],
                    isLoading: false,
                    errors: [],
                });
                return;
            }

            axios.get(ROUTES.api.rooms, {
                headers: apiHeaders,
            })
                .then(
                    (response) => setRoomOptions({
                        ...roomOptions,
                        rooms: response.data.rooms.map(mapRoomToOption),
                        isLoading: false,
                    }),
                    (error) => setRoomOptions({
                        ...roomOptions,
                        isLoading: false,
                        errors: [...roomOptions.errors, error],
                    })
                );
        },
        [changeCounter]
    );

    if (!isDisabled && roomOptions.isLoading) {
        return <p>Loading...</p>;
    }

    if (roomOptions.errors.length) {
        return <React.Fragment>
            {roomOptions.map((e, eIndex) => <p key={eIndex}>{e.message}</p>)}
        </React.Fragment>;
    }

    return <form className='form' method='POST' onSubmit={handleSubmit}>
        <ReservationFormFields
            entityExists={entityExists}
            roomOptions={roomOptions.rooms}
            isDisabled={isDisabled}
            onValueChange={onValueChange}
            formData={formData}
            errors={errors}
            readOnlyValues={readOnlyValues}
        />
        <ReservationFormFooter
            reservation={reservation}
            entityExists={entityExists}
            isDisabled={isDisabled}
            allowedToCancel={allowedToCancel}
            getDeletePromise={getDeleteReservationPromise}
            editUrl={urls.edit}
            redirectUrl={urls.redirect}
            error={errors.general}
        />
    </form>;
}

ReservationForm.propTypes = {
    reservation: PropTypes.object,
    isDisabled: PropTypes.bool,
    allowedToCancel: PropTypes.bool,
    apiHeaders: PropTypes.object,
    addSuccessMessage: PropTypes.func,
    changeCounter: PropTypes.number,
    increaseChangeCounter: PropTypes.func,
};

const mapStateToProps = (state) => ({
    apiHeaders: state.auth.apiHeaders,
    changeCounter: state.change.counter,
});

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
    increaseChangeCounter: () => dispatch(increaseChangeCounter()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReservationForm);
