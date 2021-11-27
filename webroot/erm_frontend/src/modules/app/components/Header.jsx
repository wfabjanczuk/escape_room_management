import React from 'react';
import {Link} from 'react-router-dom';

const Header = () => (<header>
    <h1><Link className='hoverable' to='/'>Escape Room Management</Link></h1>
    <Link className='logo-link hoverable' to='/'>
        <img className='header-logo' src={'logo.png'} alt='Escape Room Management Logo'/>
    </Link>
</header>);

export default Header;