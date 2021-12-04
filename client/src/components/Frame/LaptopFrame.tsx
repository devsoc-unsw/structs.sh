import React from 'react';
import laptopImg from 'assets/img/laptop-frame.png';
import styles from './LaptopFrame.module.scss';
import { Box } from '@mui/material';

interface Props {}

const LaptopFrame: React.FC<Props> = () => {
    return (
        <Box className={styles.computer}>
            <img src={laptopImg} alt="MacBook Computer Apple" />
            <Box className={styles.screen} />
        </Box>
    );
};

export default LaptopFrame;
