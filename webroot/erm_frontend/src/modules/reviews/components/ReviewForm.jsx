import React, {useEffect, useState} from 'react';
import * as PropTypes from 'prop-types';
import NewFormValidator from '../../app/utils/FormValidator';
import ReviewFormFields from './ReviewFormFields';
import ROUTES, {getRouteWithParams} from '../../app/constants/routes';
import {addSuccessMessage} from '../../app/redux/flash/flashActions';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {get as _get} from 'lodash';
import getDeleteReviewPromise from '../utils/getDeleteReviewPromise';
import {sendData} from '../../app/utils/form';
import axios from 'axios';
import ReviewFormFooter from './ReviewFormFooter';

const getInitialFormData = (review) => {
    if (review) {
        return {
            id: review.id,
            guestId: review.guestId,
            roomId: review.roomId,
            rating: review.rating,
            comment: review.comment,
            reply: review.reply,
        };
    }

    return {
        id: '',
        guestId: '',
        roomId: '',
        rating: '',
        comment: '',
        reply: '',
    };
};

const getUrls = (review, entityExists, isDisabled) => {
    const apiUrl = entityExists
            ? getRouteWithParams(ROUTES.api.review, {id: review.id})
            : ROUTES.api.reviews,
        cancelUrl = entityExists
            ? getRouteWithParams(ROUTES.reviews.details, {id: review.id})
            : ROUTES.reviews.index,
        editUrl = entityExists
            ? getRouteWithParams(ROUTES.reviews.edit, {id: review.id})
            : '',
        redirectUrl = isDisabled
            ? ROUTES.reviews.index
            : cancelUrl;

    return {
        api: apiUrl,
        edit: editUrl,
        redirect: redirectUrl,
    }
};

const validateFormData = (formData, setErrors) => {
    const formValidator = NewFormValidator(formData);

    formValidator.required(['guestId', 'roomId', 'rating'])
    formValidator.intMinMax(['rating'], 0, 5);
    formValidator.maxLength(['comment', 'reply'], 300);

    if (!formValidator.isValid()) {
        setErrors(formValidator.errors);
        return false;
    }

    return true;
};

const ReviewForm = ({review, isDisabled, changeCounter, currentUser, guestId, apiHeaders, addSuccessMessage}) => {
    const id = parseInt(_get(review, 'id', null), 10),
        entityExists = !!review,
        urls = getUrls(review, entityExists, isDisabled),
        navigate = useNavigate(),
        [formData, setFormData] = useState(getInitialFormData(review)),
        [errors, setErrors] = useState({}),
        [roomOptions, setRoomOptions] = useState({
            rooms: [],
            isLoading: true,
            errors: [],
        }),
        [guestOptions, setGuestOptions] = useState({
            guests: [],
            isLoading: true,
            errors: [],
        }),
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
                sendData(submittedFormData, urls.api, urls.redirect, entityExists, apiHeaders, setErrors, addSuccessMessage, navigate, 'Review');
            }
        };

    useEffect(() => {
            const mapRoomToOption = (r) => ({id: r.id, label: r.name});

            if (isDisabled) {
                setRoomOptions({
                    rooms: [mapRoomToOption(review.room)],
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

    useEffect(() => {
            const mapGuestToOption = (g) => ({id: g.id, label: `${g.user.firstName} ${g.user.lastName}`});

            if (guestId) {
                setGuestOptions({
                    guests: [{id: guestId, label: `${currentUser.firstName} ${currentUser.lastName}`}],
                    isLoading: false,
                    errors: [],
                });
                return;
            }

            if (isDisabled) {
                setGuestOptions({
                    guests: [mapGuestToOption(review.guest)],
                    isLoading: false,
                    errors: [],
                });
                return;
            }

            axios.get(ROUTES.api.guests, {
                headers: apiHeaders,
            })
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

    if (!isDisabled && (roomOptions.isLoading || guestOptions.isLoading)) {
        return <p>Loading...</p>;
    }

    if (roomOptions.errors.length || guestOptions.errors.length) {
        return <React.Fragment>
            {[...roomOptions.errors, ...guestOptions.errors].map(
                (e, eIndex) => <p key={eIndex}>{e.message}</p>
            )}
        </React.Fragment>;
    }

    return <form className='form' method='POST' onSubmit={handleSubmit}>
        <ReviewFormFields
            entityExists={entityExists}
            roomOptions={roomOptions.rooms}
            guestOptions={guestOptions.guests}
            isDisabled={isDisabled}
            onValueChange={onValueChange}
            formData={formData}
            errors={errors}
        />
        <ReviewFormFooter
            id={id}
            entityExists={entityExists}
            isDisabled={isDisabled}
            getDeletePromise={getDeleteReviewPromise}
            editUrl={urls.edit}
            redirectUrl={urls.redirect}
            error={errors.general}
        />
    </form>;
}

ReviewForm.propTypes = {
    review: PropTypes.object,
    isDisabled: PropTypes.bool,
    changeCounter: PropTypes.number,
    guestId: PropTypes.number,
    currentUser: PropTypes.object,
    apiHeaders: PropTypes.object,
    addSuccessMessage: PropTypes.func,
};

const mapStateToProps = (state) => ({
    changeCounter: state.change.counter,
    guestId: state.auth.guestId,
    currentUser: state.auth.currentUser,
    apiHeaders: state.auth.apiHeaders,
});

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewForm);
