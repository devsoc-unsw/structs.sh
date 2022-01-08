import React from 'react';
import laptopImg from 'assets/img/laptop-frame.png';
import styles from './LaptopFrame.module.scss';
import { Box } from '@mui/material';

interface Props {
    imageUrl: string;
}

const LaptopFrame: React.FC<Props> = ({ imageUrl }) => {
    return (
        <Box className={styles.computer}>
            <img src={laptopImg} alt="MacBook Computer Apple" />
            <Box className={styles.screen} sx={{ background: `url(${imageUrl})` }} />
        </Box>
    );
};

export default LaptopFrame;
