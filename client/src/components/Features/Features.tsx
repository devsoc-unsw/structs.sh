import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Box, Grid, Link, List, ListItem, ListItemIcon, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import BulletIcon from '@mui/icons-material/ArrowForwardIos';
import VisualiserIcon from '@mui/icons-material/AutoFixHigh';
import EditIcon from '@mui/icons-material/Edit';
import EducationIcon from '@mui/icons-material/LocalLibrary';
import GradCapIcon from '@mui/icons-material/School';
import cmsScreen from 'assets/demos/cms.png';
import visualiserDashboardCodeScreen from 'assets/demos/visualiser-dashboard-code.png';
import visualiserDashboardLessonScreen from 'assets/demos/visualiser-dashboard-lesson.png';
import structsLogo from 'assets/img/structs.png';
import { LaptopFrame } from 'components/Frame';
import HorizontalRule from 'components/HorizontalRule';
import FeatureItem from './FeatureItem';

const variants = {
  visible: { opacity: 1, transition: { duration: 3 } },
  hidden: { opacity: 0, transition: { duration: 0.2 } },
};

const StyledBulletIcon = styled(BulletIcon)(({ theme }) => ({
  fill: theme.palette.text.secondary,
}));

/**
 * A list of features to display on the homepage
 */
const Features = () => {
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
    <motion.div variants={variants} initial="hidden" animate={controls} ref={ref}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <img src={structsLogo} alt="logo" width={100} />
        <Typography color="textPrimary" variant="h4">
          Structs.sh
        </Typography>
      </Box>
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
                  <StyledBulletIcon />
                </ListItemIcon>
                <Typography color="textSecondary">
                  Visualise algorithms for fundamental operations on classic data structures such as
                  linked lists, binary search trees and graphs.
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StyledBulletIcon />
                </ListItemIcon>
                <Typography color="textSecondary">
                  Granular animation control with play/pause, stepping, slider and speed control
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StyledBulletIcon />
                </ListItemIcon>
                <Typography color="textSecondary">
                  Control the visualiser through a simple menu
                </Typography>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={12} md={4} sx={{ position: 'relative', height: '200px' }}>
            <LaptopFrame imageUrl={visualiserDashboardCodeScreen} />
          </Grid>
        </Grid>
      </FeatureItem>
      <FeatureItem>
        <Typography color="textPrimary" variant="h6">
          <GradCapIcon /> Open source
        </Typography>
        <Typography color="textSecondary" variant="body1">
          Developed and maintained by passionate CS and engineering students at UNSW.
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <StyledBulletIcon />
            </ListItemIcon>
            <Typography color="textSecondary">
              <Link
                href="https://github.com/devsoc-unsw/structs.sh"
                color="textSecondary"
                target="_blank"
              >
                GitHub
              </Link>
            </Typography>
          </ListItem>
        </List>
        <Box padding="20px">
          <div
            className="github-card"
            data-github="devsoc-unsw/structs.sh"
            data-width="100%"
            data-theme="medium"
          />
        </Box>
      </FeatureItem>
    </motion.div>
  );
};

export default Features;
