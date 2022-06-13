import BulletIcon from '@mui/icons-material/ArrowForwardIos';
import VisualiserIcon from '@mui/icons-material/AutoFixHigh';
import EditIcon from '@mui/icons-material/Edit';
import EducationIcon from '@mui/icons-material/LocalLibrary';
import GradCapIcon from '@mui/icons-material/School';
import { Box, Grid, Link, List, ListItem, ListItemIcon, Typography } from '@mui/material';
import cmsScreen from 'assets/demos/cms.png';
import visualiserDashboardCodeScreen from 'assets/demos/visualiser-dashboard-code.png';
import visualiserDashboardLessonScreen from 'assets/demos/visualiser-dashboard-lesson.png';
import structsLogo from 'assets/img/structs.png';
import { LaptopFrame } from 'components/Frame';
import { HorizontalRule } from 'components/HorizontalRule';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink } from 'react-router-dom';
import FeatureItem from './FeatureItem';
import styles from './Features.module.scss';

interface Props {}

const variants = {
  visible: { opacity: 1, transition: { duration: 3 } },
  hidden: { opacity: 0, transition: { duration: 0.2 } },
};

const Features: React.FC<Props> = () => {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//cdn.jsdelivr.net/github-cards/latest/widget.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <motion.div
      className={styles.featureSection}
      variants={variants}
      initial="hidden"
      animate={controls}
      ref={ref}
    >
      <img src={structsLogo} className={styles.logo} alt="Structs.sh logo" />
      <Typography className={styles.title} color="textPrimary" variant="h4">
        Structs.sh
      </Typography>
      <HorizontalRule />
      <FeatureItem>
        <Typography color="textPrimary" variant="h6">
          <VisualiserIcon /> Algorithm Visualisation
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={12} md={8}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <BulletIcon color="primary" />
                </ListItemIcon>
                <Typography color="textSecondary">
                  Visualise algorithms for fundamental operations on classic data structures such as
                  linked lists, binary search trees and graphs.
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BulletIcon color="primary" />
                </ListItemIcon>
                <Typography color="textSecondary">
                  Granular animation control with play/pause, stepping, slider and speed control
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BulletIcon color="primary" />
                </ListItemIcon>
                <Typography color="textSecondary">
                  Control the visualiser through an integrated terminal or through a simple menu
                </Typography>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={12} md={4} sx={{ position: 'relative', height: '200px' }}>
            <LaptopFrame imageUrl={visualiserDashboardCodeScreen} />
          </Grid>
        </Grid>
      </FeatureItem>
      {/* <FeatureItem fromDirection="left">
        <Typography color="textPrimary" variant="h6" sx={{ textAlign: 'left' }}>
          <EducationIcon />
          {' '}
          Educational Resources
        </Typography>

        <Grid container>
          <Grid item xs={12} sm={12} md={8}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <BulletIcon color="primary" />
                </ListItemIcon>
                <Typography color="textSecondary">
                  Access resources about computer science and software engineering, written and
                  peer-reviewed by the UNSW CSE teaching community
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BulletIcon color="primary" />
                </ListItemIcon>
                <Typography color="textSecondary">
                  Lessons, videos and reference implementations all in one place
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BulletIcon color="primary" />
                </ListItemIcon>
                <Typography color="textSecondary">
                  Bridge the gap between a high-level visual understanding of an algorithm and the
                  implementation itself
                </Typography>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={12} md={4} sx={{ position: 'relative', height: '200px' }}>
            <LaptopFrame imageUrl={visualiserDashboardLessonScreen} />
          </Grid>
        </Grid>
      </FeatureItem> */}
      {/* <FeatureItem fromDirection="left">
        <Typography color="textPrimary" variant="h6" sx={{ textAlign: 'left' }}>
          <EditIcon /> Content Management
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={12} md={8}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <BulletIcon color="primary" />
                </ListItemIcon>
                <Typography color="textSecondary">
                  Manage and create new topics, source code snippets, lessons and quizzes
                </Typography>
              </ListItem>
            </List>
            <List>
              <ListItem>
                <ListItemIcon>
                  <BulletIcon color="primary" />
                </ListItemIcon>
                <Typography color="textSecondary">
                  Community-contributed resources for all students
                </Typography>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={12} md={4} sx={{ position: 'relative', height: '200px' }}>
            <LaptopFrame imageUrl={cmsScreen} />
          </Grid>
        </Grid>
      </FeatureItem> */}
      <FeatureItem fromDirection="right">
        <Typography color="textPrimary" variant="h6">
          <GradCapIcon /> Open source
        </Typography>
        <Typography color="textSecondary" variant="body1">
          Developed and maintained by passionate CS and engineering students at UNSW.
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <BulletIcon color="primary" />
            </ListItemIcon>
            <Typography color="textSecondary">
              <Link
                href="https://github.com/csesoc/Structs.sh"
                color="textSecondary"
                target="_blank"
              >
                GitHub
              </Link>
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BulletIcon color="primary" />
            </ListItemIcon>
            <Typography color="textSecondary">
              The Structs.sh <RouterLink to="/about">team</RouterLink>
            </Typography>
          </ListItem>
        </List>
        <Box sx={{ mt: 4 }}>
          <div
            className="github-card"
            data-github="csesoc/structs.sh"
            data-width="100%"
            data-theme="medium"
          />
        </Box>
      </FeatureItem>
    </motion.div>
  );
};

export default Features;
