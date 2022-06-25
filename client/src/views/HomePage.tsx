import { Container, Theme, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/styles';
import { Topics } from 'components/Topics';
import { Footer } from 'components/Footer';
import { ParticleHeader } from 'components/Particles';
import { Features } from 'components/Features';
import { HomepageLayout } from 'layout';
import React from 'react';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const theme: Theme = useTheme();

  return (
    <HomepageLayout disableBackground>
      <ParticleHeader />
      <Box className={styles.header}>
        <Typography
            color="white"
            className={styles.title}
            variant="h4"
            sx={{ padding: '2', marginTop: '5%' }}
          >
            <strong>Welcome to Structs.sh</strong>
          </Typography>
          <Typography
            color="white"
            className={styles.description}
            variant="body1"
            sx={{ padding: 2 }}
          >
            An interactive learning platform for computer science, tailored to UNSW CSE students.
          </Typography>
          <Box sx={{ width: '85%', margin: '0 auto', height: 'auto' }}>
            <Topics />
          </Box>
      </Box>
      <Box
        sx={{
          background: theme.palette.background.paper,
          position: 'relative',
          boxShadow: 'rgba(0, 0, 0, 0.4) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
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
