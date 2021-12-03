import { Box, Grid, Link, List, ListItem, ListItemIcon, Typography } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './Features.module.scss';
import FeatureItem from './FeatureItem';
import VisualiserIcon from '@mui/icons-material/AutoFixHigh';
import EducationIcon from '@mui/icons-material/LocalLibrary';
import ToolIcon from '@mui/icons-material/Handyman';
import GradCapIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import structsLogo from 'assets/img/structs.png';
import { LaptopFrame } from 'components/Frame';
import BulletIcon from '@mui/icons-material/ArrowForwardIos';
import { Link as RouterLink } from 'react-router-dom';

interface Props {}

const variants = {
    visible: { opacity: 1, transition: { duration: 3 } },
    hidden: { opacity: 0, transition: { duration: 0.2 } },
};

const Features: React.FC<Props> = () => {
    const { ref, inView, entry } = useInView({
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
            <img src={structsLogo} className={styles.logo} />
            <Typography className={styles.title} color="textPrimary" variant="h4">
                Structs.sh
            </Typography>
            {/* TODO: each feature section should have their own 'in view' animation set */}
            <FeatureItem>
                <Typography color="textPrimary" variant="h6">
                    <VisualiserIcon /> Algorithm Visualisation
                </Typography>
                <Grid container>
                    <Grid item xs={12} sm={12} md={8}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <BulletIcon color={'primary'} />
                                </ListItemIcon>
                                <Typography color="textSecondary">
                                    Visualise algorithms for fundamental operations on classic data
                                    structures such as linked lists, binary search trees and graphs.
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <BulletIcon color={'primary'} />
                                </ListItemIcon>
                                <Typography color="textSecondary">
                                    Granular animation control with play/pause, stepping, slider and
                                    speed control
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <BulletIcon color={'primary'} />
                                </ListItemIcon>
                                <Typography color="textSecondary">
                                    Control the visualiser through an integrated terminal or through
                                    a simple menu
                                </Typography>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        sx={{ position: 'relative', height: '200px' }}
                    >
                        <LaptopFrame />
                    </Grid>
                </Grid>
            </FeatureItem>
            <FeatureItem fromDirection={'right'}>
                <Typography color="textPrimary" variant="h6" sx={{ textAlign: 'right' }}>
                    Educational Resources <EducationIcon />
                </Typography>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        sx={{ position: 'relative', height: '200px' }}
                    >
                        <LaptopFrame />
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <BulletIcon color={'primary'} />
                                </ListItemIcon>
                                <Typography color="textSecondary">
                                    Access resources about computer science and software
                                    engineering, written and peer-reviewed by the UNSW CSE teaching
                                    community
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <BulletIcon color={'primary'} />
                                </ListItemIcon>
                                <Typography color="textSecondary">
                                    Lessons, videos and reference implementations all in one place
                                </Typography>
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </FeatureItem>
            <FeatureItem>
                <Typography color="textPrimary" variant="h6">
                    <ToolIcon /> Tool for Teachers
                </Typography>
                <Grid container>
                    <Grid item xs={12} sm={12} md={8}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <BulletIcon color={'primary'} />
                                </ListItemIcon>
                                <Typography color="textSecondary">
                                    Helps teachers bridge the gap between high-level visual
                                    understanding and the source code for their students
                                </Typography>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        sx={{ position: 'relative', height: '200px' }}
                    >
                        <LaptopFrame />
                    </Grid>
                </Grid>
            </FeatureItem>
            <FeatureItem fromDirection="right">
                <Typography color="textPrimary" variant="h6" sx={{ textAlign: 'right' }}>
                    Content Management <EditIcon />
                </Typography>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        sx={{ position: 'relative', height: '200px' }}
                    >
                        <LaptopFrame />
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <BulletIcon color={'primary'} />
                                </ListItemIcon>
                                <Typography color="textSecondary">
                                    Manage topics, source code, lessons and quizzes and contribute
                                    more resources for students to access
                                </Typography>
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </FeatureItem>
            <FeatureItem>
                <Typography color="textPrimary" variant="h6">
                    <GradCapIcon /> Open source project, developed and maintained by passionate CSE
                    students
                </Typography>
                <Grid container>
                    <Grid item xs={12} sm={12} md={6}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <BulletIcon color={'primary'} />
                                </ListItemIcon>
                                <Typography color="textSecondary">
                                    <Link
                                        href="https://github.com/csesoc/Structs.sh"
                                        color="textSecondary"
                                        target="_blank"
                                    >
                                        GitHub repo
                                    </Link>
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <BulletIcon color={'primary'} />
                                </ListItemIcon>
                                <Typography color="textSecondary">
                                    The{' '}
                                    <RouterLink to="/about">
                                        <Link color="textSecondary">team</Link>
                                    </RouterLink>
                                </Typography>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Box sx={{ mt: 4 }}>
                            <div
                                className="github-card"
                                data-github="csesoc/structs.sh"
                                data-width="100%"
                                data-theme="medium"
                            />
                        </Box>
                    </Grid>
                </Grid>
            </FeatureItem>
        </motion.div>
    );
};

export default Features;
