import { Box, Divider, Typography } from '@mui/material';
import { HomepageLayout } from 'layout';
import React, { FC } from 'react';
import Container from '@mui/material/Container';
import styles from './AboutUs.module.scss';
import { Gallery } from 'components/Gallery';
import { team2021 } from 'assets/about/team-2021';

interface Props {}

const About: FC<Props> = () => {
    return (
        <HomepageLayout topNavPosition="fixed" enableOnScrollEffect={false}>
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
                        science and engineering students at UNSW. [Note: elaborate on the ideation
                        and development]
                    </Typography>
                    <Divider />
                    <Typography color="textPrimary" variant="h4" className={styles.text}>
                        The 2021 Team
                    </Typography>
                    <Container maxWidth={'sm'}>
                        <Gallery items={team2021} />
                    </Container>
                </Container>
            </Box>
        </HomepageLayout>
    );
};

export default About;
