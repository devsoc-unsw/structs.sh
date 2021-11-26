import { Box, Typography } from '@mui/material';
import { HomepageLayout } from 'layout';
import React, { FC } from 'react';
import Container from '@mui/material/Container';
import styles from './AboutUs.module.scss';
import { Gallery } from 'components/Gallery';

interface Props {}

const About: FC<Props> = () => {
    return (
        <HomepageLayout>
            <Box sx={{ marginTop: '80px', textAlign: 'center', height: 'calc(100vh - 80px)' }}>
                <Container maxWidth="md" className={styles.container}>
                    <Typography color="textPrimary" variant="h3" className={styles.text}>
                        About Us
                    </Typography>
                    <Typography color="textPrimary" variant="h4" className={styles.text}>
                        The Project
                    </Typography>
                    <Typography color="textPrimary" variant="body1" className={styles.text}>
                        <strong>Structs.sh</strong> was a project developed by passionate computer
                        science and engineering students at UNSW.
                    </Typography>
                    <hr />
                    <Typography color="textPrimary" variant="h4" className={styles.text}>
                        The 2021 Team
                    </Typography>
                    <Gallery />
                </Container>
            </Box>
        </HomepageLayout>
    );
};

export default About;
