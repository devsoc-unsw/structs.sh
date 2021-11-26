import { motion } from 'framer-motion';
import React, { FC } from 'react';
import styles from './VisualiserDashboardLayout.module.scss';
import Helmet from 'react-helmet';
import TopNavbar from 'components/Navbars/TopNavbar';
import { Theme } from '@mui/material';
import { useTheme } from '@mui/styles';
import Box from '@mui/material/Box';

const containerVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: { duration: 1 },
    },
    exit: {
        opacity: '-100vw',
        transition: { ease: 'easeInOut' },
    },
};

interface Props {
    children: React.ReactNode;
    topic: string;
}

const Dashboard: FC<Props> = ({ children, topic }) => {
    const theme: Theme = useTheme();

    return (
        <motion.div
            className={styles.container}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Helmet>
                <title>Structs.sh — {topic}</title>
            </Helmet>
            <TopNavbar position="static" enableOnScrollEffect={false} />
            <Box
                sx={{
                    backgroundColor: theme.palette.background.default,
                    height: '100vh',
                    width: '100vw',
                }}
            >
                {children}
            </Box>
        </motion.div>
    );
};

export default Dashboard;
