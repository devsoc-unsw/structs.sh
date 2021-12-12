import { Container, Theme, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/styles';
import { Footer } from 'components/Footer';
import { SplashScreen } from 'components/SplashScreen';
import { HomepageLayout } from 'layout';
import React from 'react';
import styles from './HomePage.module.scss';
import { ParticleHeader } from 'components/Particles';
import { Carousel } from 'components/Carousel';
import { Features } from 'components/Sections';

const HomePage = () => {
    const theme: Theme = useTheme();

    return (
        <HomepageLayout disableBackground>
            <SplashScreen stillDuration={2.5} disappearDuration={1.5} waitIntervalMinutes={1} />
            <ParticleHeader />
            <Box className={styles.header}>
                <Box
                    className={styles.headerContent}
                    sx={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        boxShadow:
                            'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
                        paddingTop: 3,
                    }}
                >
                    <Typography color="white" className={styles.title}>
                        <strong>Welcome to Structs.sh</strong>
                    </Typography>
                    <Typography color="white" className={styles.description}>
                        An interactive learning platform for computer science, tailored to UNSW CSE
                        students.
                    </Typography>
                    <Box sx={{ width: '80%', margin: '0 auto', height: '400px' }}>
                        <Carousel />
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    background: theme.palette.background.paper,
                    boxShadow:
                        'rgba(0, 0, 0, 0.4) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
                }}
                className={styles.features}
            >
                <Container maxWidth="md">
                    <Features />
                </Container>
            </Box>
            <Footer />
        </HomepageLayout>
    );
};

export default HomePage;
