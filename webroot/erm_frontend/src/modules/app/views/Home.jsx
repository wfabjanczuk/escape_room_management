import React from 'react';
import {useTranslation} from "react-i18next";

const Home = () => {
    const {t} = useTranslation();

    return <React.Fragment>
        <h2>{t('home')}</h2>
        <p>{t('welcome')}</p>
    </React.Fragment>;
};

export default Home;
