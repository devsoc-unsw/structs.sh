import React from 'react';
import logo from 'assets/img/logo.png';
import { motion } from 'framer-motion';
import styles from './SplashScreen.module.scss';

interface Props {}

const SplashScreenLogo: React.FC<Props> = () => (
  <motion.img
    animate={{ opacity: [0, 0, 1], x: [-100, -100, 0], y: [-70, -70, 0] }}
    transition={{ duration: 2 }}
    className={styles.brandImage}
    src={logo}
  />
);

export default SplashScreenLogo;
