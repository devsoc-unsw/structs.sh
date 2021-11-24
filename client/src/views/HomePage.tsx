import Layout from 'layout/Layout';
import React from 'react';
import styles from './HomePage.module.scss';
import { SplashScreen } from 'components/SplashScreen';

const HomePage = (props) => {
    return (
        <Layout>
            <SplashScreen stillDuration={2.5} disappearDuration={1.5} />
            <div className={styles.headerContent}>
                <h1 className={styles.title}>
                    <strong>Welcome to Structs.sh</strong>
                </h1>
                <p className={styles.description}>
                    An interactive learning platform designed for UNSW CSE students
                </p>
            </div>
        </Layout>
    );
};

export default HomePage;
