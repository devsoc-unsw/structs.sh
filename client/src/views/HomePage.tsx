import Layout from 'layout/Layout';
import React, { useContext } from 'react';
import styles from './HomePage.module.scss';
import { SplashScreen } from 'components/SplashScreen';
import { Theme, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/styles';
import { ThemeMutationContext } from 'App';

const HomePage = (props) => {
    const context = useContext(ThemeMutationContext);

    return (
        <Layout>
            <SplashScreen stillDuration={2.5} disappearDuration={1.5} waitIntervalMinutes={1} />
            <Box
                className={styles.header}
                sx={{
                    height: 'calc(100vh - 64px)', // 64px is the default height of the MUI app bar
                    marginTop: '64px',
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
                    <p></p>
                    <Button variant="contained" onClick={() => context.toggleDarkMode()}>
                        Toggle Dark Mode
                    </Button>
                </Box>
            </Box>
        </Layout>
    );
};

export default HomePage;
