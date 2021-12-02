import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
    children: React.ReactNode;
}

const variants = {
    visible: { opacity: 1, x: 0, transition: { duration: 2 } },
    hidden: { opacity: 0, x: -200, transition: { duration: 0.2 } },
};

const FeatureItem: React.FC<Props> = ({ children }) => {
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
            {children}
        </motion.div>
    );
};

export default FeatureItem;
