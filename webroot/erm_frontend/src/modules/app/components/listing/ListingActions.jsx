import React from 'react';
import {Link} from 'react-router-dom';
import * as PropTypes from 'prop-types';
import {getRouteWithParams} from '../../constants/routes';
import {connect} from 'react-redux';
import {addErrorMessage, addSuccessMessage} from '../../redux/flash/flashActions';
import {increaseChangeCounter} from '../../redux/change/changeActions';
import {ROLE_ADMIN, ROLE_GUEST} from '../../constants/roles';
import {showModal} from '../../redux/modal/modalActions';

const ListingActions = (
    {
        row,
        route,
        getDeletePromise,
        isGuestAuthorized,
        currentUser,
        apiHeaders,
        addSuccessMessage,
        addErrorMessage,
        increaseChangeCounter,
        renderActions,
        actionsRenderer,
        showModal,
    }
) => {
    if (!renderActions) {
        return null;
    }

    if (actionsRenderer) {
        return actionsRenderer(row);
    }

    const onDelete = () => getDeletePromise(row.id, apiHeaders, addSuccessMessage, addErrorMessage)
        .finally(() => increaseChangeCounter());

    return <ul className='listing__actions'>
        <li className='action'>
            <Link className='button button--primary hoverable' to={getRouteWithParams(route.details, {id: row.id})}>
                Details
            </Link>
        </li>
        {currentUser && (currentUser.roleId === ROLE_ADMIN || currentUser.roleId === ROLE_GUEST && isGuestAuthorized) &&
            <React.Fragment>
                <li className='action'>
                    <Link className='button button--warning hoverable'
                          to={getRouteWithParams(route.edit, {id: row.id})}>
                        Edit
                    </Link>
                </li>
                <li className='action'>
                    <div className='button button--danger hoverable' onClick={() => showModal(onDelete)}>
                        Delete
                    </div>
                </li>
            </React.Fragment>
        }
    </ul>;
};

ListingActions.propTypes = {
    row: PropTypes.object,
    route: PropTypes.object,
    getDeletePromise: PropTypes.func,
    isGuestAuthorized: PropTypes.bool,
    currentUser: PropTypes.object,
    apiHeaders: PropTypes.object,
    addSuccessMessage: PropTypes.func,
    addErrorMessage: PropTypes.func,
    increaseChangeCounter: PropTypes.func,
    renderActions: PropTypes.bool,
    actionsRenderer: PropTypes.func,
    showModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
    apiHeaders: state.auth.apiHeaders,
});

const mapDispatchToProps = (dispatch) => ({
    addSuccessMessage: (content) => dispatch(addSuccessMessage(content)),
    addErrorMessage: (content) => dispatch(addErrorMessage(content)),
    increaseChangeCounter: () => dispatch(increaseChangeCounter()),
    showModal: (onConfirm) => dispatch(showModal(onConfirm)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListingActions);