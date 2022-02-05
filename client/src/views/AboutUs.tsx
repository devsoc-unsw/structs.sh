import { Box, Divider, Typography } from '@mui/material';
import { HomepageLayout } from 'layout';
import React, { FC } from 'react';
import Container from '@mui/material/Container';
import { Gallery } from 'components/Gallery';
import team2021 from 'assets/about/team-2021';
import styles from './AboutUs.module.scss';

interface Props {}

const About: FC<Props> = () => (
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
          <strong>Structs.sh</strong>
          {' '}
          is a project that aims to be a comprehensive
          educational resource for data structures and algorithms, developed by
          passionate computer science and engineering students at UNSW. It features an
          interactive algorithm visualiser, integrated educational content and a CMS.
        </Typography>
        <Typography color="textPrimary" variant="body1" className={styles.text}>
          Structs.sh was inspired by
          {' '}
          <a href="https://github.com/Tymotex/Tactile-DS">Tactile DS</a>
          , an earlier
          project developed in 2020 as a tutoring tool and reference for students to
          use in
          {' '}
          <a href="https://www.handbook.unsw.edu.au/undergraduate/courses/2022/COMP2521/?year=2022">
            COMP2521
          </a>
          .
        </Typography>
        <Divider />
        <Typography color="textPrimary" variant="h4" className={styles.text}>
          The 2021 Team
        </Typography>
        <Container maxWidth="sm">
          <Gallery items={team2021} />
        </Container>
      </Container>
    </Box>
  </HomepageLayout>
);

export default About;
