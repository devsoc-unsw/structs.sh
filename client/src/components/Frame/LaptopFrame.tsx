import React from 'react';
import laptopImg from '@/assets/img/laptop-frame.png';
import Box from '@mui/material/Box';
import styles from './LaptopFrame.module.scss';

interface Props {
  imageUrl: string;
}

const LaptopFrame: React.FC<Props> = ({ imageUrl }) => (
  <Box className={styles.computer}>
    <img src={laptopImg} alt="MacBook Computer Apple" />
    <Box
      className={styles.screen}
      sx={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
  </Box>
);

export default LaptopFrame;
