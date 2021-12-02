import { Box, Typography } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './Features.module.scss';
import FeatureItem from './FeatureItem';

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

    return (
        <motion.div variants={variants} initial="hidden" animate={controls} ref={ref}>
            <Typography className={styles.title} color="textPrimary" variant="h4">
                Structs.sh
            </Typography>
            {/* TODO: each feature section should have their own 'in view' animation set */}
            <FeatureItem>
                <Typography color="textPrimary" variant="h6">
                    Algorithm Visualisation
                </Typography>
            </FeatureItem>
            <FeatureItem>
                <Typography color="textPrimary" variant="h6">
                    Educational Resources
                </Typography>
            </FeatureItem>
            <FeatureItem>
                <Typography color="textPrimary" variant="h6">
                    Tool for Teachers
                </Typography>
            </FeatureItem>
            <FeatureItem>
                <Typography color="textPrimary" variant="h6">
                    Content Management
                </Typography>
            </FeatureItem>
            <FeatureItem>
                <Typography color="textPrimary" variant="h6">
                    Maintained by Passionate Students
                </Typography>
            </FeatureItem>
        </motion.div>
    );
};

export default Features;
