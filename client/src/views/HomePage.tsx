import { Container, Theme, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/styles';
import { Footer } from 'components/Footer';
import { SplashScreen } from 'components/SplashScreen';
import { HomepageLayout } from 'layout';
import React from 'react';
import styles from './HomePage.module.scss';

const HomePage = () => {
    const theme: Theme = useTheme();

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
            <Box sx={{ background: theme.palette.background.paper }} className={styles.features}>
                <Container maxWidth="md">
                    <Typography color="textPrimary" variant="h4">
                        Features
                    </Typography>
                </Container>
            </Box>
            <Footer />
        </HomepageLayout>
    );
};

export default HomePage;
