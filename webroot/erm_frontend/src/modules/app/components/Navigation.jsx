import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import getNavigationLinks from '../utils/getNavigationLinks';

const Navigation = ({currentUser}) => {
    const {pathname} = useLocation();

    return <nav>
        <ul>
            {getNavigationLinks(currentUser, pathname).map((l, lIndex) =>
                <li key={lIndex}>
                    <Link className={`hoverable ${l.isActive ? 'active' : ''}`} to={l.route}>
                        {l.label}
                    </Link>
                </li>
            )}
        </ul>
    </nav>;
};

Navigation.propTypes = {
    currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(Navigation);