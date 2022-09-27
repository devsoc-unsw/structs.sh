import { Container, Theme, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/styles';
import { styled } from '@mui/system';
import { Topics } from 'components/Topics';
import { Footer } from 'components/Footer';
import { Features } from 'components/Features';
import { HomepageLayout } from 'layout';
import Helmet from 'react-helmet';
import React from 'react';
import styles from './HomePage.module.scss';

const TopicBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  textAlign: 'center',
  backgroundImage: `linear-gradient(to bottom, #18154f, ${theme.palette.primary.main})`,
}));

const HomePage = () => {
  const theme: Theme = useTheme();

  return (
    <HomepageLayout>
      <Helmet>
        <title>Structs.sh</title>
      </Helmet>
      <TopicBox>
        <Typography variant="h4">
          <strong>Welcome to Structs.sh</strong>
        </Typography>
        <Typography variant="body1">
          An interactive learning platform for computer science, tailored to UNSW CSE students.
        </Typography>
        <Topics />
      </TopicBox>
      <Box position="relative" bgcolor={theme.palette.primary.main}>
        <Container maxWidth="md">
          <Features />
        </Container>
      </Box>
      <Footer />
    </HomepageLayout>
  );
};

export default HomePage;
