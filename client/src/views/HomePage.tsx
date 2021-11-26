import { HomepageLayout } from 'layout';
import React, { useContext } from 'react';
import styles from './HomePage.module.scss';
import { SplashScreen } from 'components/SplashScreen';
import { Theme, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/styles';
import { ThemeMutationContext } from 'App';
import { Footer } from 'components/Footer';

const HomePage = () => {
    return (
        <HomepageLayout>
            <SplashScreen stillDuration={2.5} disappearDuration={1.5} waitIntervalMinutes={10} />
            <Box
                className={styles.header}
                sx={{
                    height: '100vh',
                }}
            >
                <Box className={styles.headerContent}>
                    <Typography color="textPrimary" className={styles.title}>
                        <strong>Welcome to Structs.sh</strong>
                    </Typography>
                    <Typography color="textSecondary" className={styles.description}>
                        An interactive learning platform for computer science, tailored to UNSW CSE
                        students.
                    </Typography>
                    <Box>
                        <Typography color="textPrimary">(Carousel here)</Typography>
                    </Box>
                </Box>
            </Box>
            <Box>
                <Typography color="textPrimary">Features</Typography>
            </Box>
            <Footer />
        </HomepageLayout>
    );
};

export default HomePage;
