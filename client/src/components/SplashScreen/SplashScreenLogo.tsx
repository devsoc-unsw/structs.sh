import React from 'react';
import logo from 'assets/img/logo.png';
import styles from './SplashScreen.module.scss';
import { motion } from 'framer-motion';

interface Props {}

const SplashScreenLogo: React.FC<Props> = () => {
    return (
        <motion.img
            animate={{ opacity: [0, 0, 1], x: [-100, -100, 0], y: [-70, -70, 0] }}
            transition={{ duration: 2 }}
            className={styles.brandImage}
            src={logo}
        />
    );
};

export default SplashScreenLogo;
