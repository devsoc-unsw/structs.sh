import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './Features.module.scss';

interface Props {
    children: React.ReactNode;
    fromDirection?: 'left' | 'right' | 'top' | 'down';
}

const FeatureItem: React.FC<Props> = ({ children, fromDirection = 'left' }) => {
    const { ref, inView, entry } = useInView({
        threshold: 0,
    });
    const controls = useAnimation();

    const variants = {
        visible: { opacity: 1, x: 0, y: 0, transition: { duration: 2 } },
        hidden: {
            opacity: 0,
            x: fromDirection === 'left' ? -200 : fromDirection === 'right' ? 200 : 0,
            y: fromDirection === 'top' ? 200 : fromDirection === 'down' ? -200 : 0,
            transition: { duration: 0.2 },
        },
    };

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    return (
        <motion.div
            className={styles.featureItem}
            variants={variants}
            initial="hidden"
            animate={controls}
            ref={ref}
        >
            {children}
        </motion.div>
    );
};

export default FeatureItem;
