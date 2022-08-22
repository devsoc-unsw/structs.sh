import { Container, Theme, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/styles';
import { Topics } from 'components/Topics';
import { Footer } from 'components/Footer';
import { Features } from 'components/Features';
import { HomepageLayout } from 'layout';
import Helmet from 'react-helmet';
import React from 'react';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const theme: Theme = useTheme();

  return (
    <HomepageLayout disableBackground>
      <Helmet>
        <title>Structs.sh</title>
      </Helmet>
      <Box className={styles.header}>
        <Typography
          color="white"
          className={styles.title}
          variant="h4"
          sx={{ padding: '2', paddingTop: '10%' }}
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
        <Topics />
      </Box>
      <Box
        sx={{
          background: theme.palette.background.paper,
          position: 'relative',
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
