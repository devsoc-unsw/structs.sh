import { Box, Theme } from '@mui/material';
import { useTheme } from '@mui/styles';
import IndexNavbar from 'components/Navbars/TopNavbar';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';

const containerVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: { duration: 1.5 },
    },
    exit: {
        opacity: '-100vw',
        transition: { ease: 'easeInOut' },
    },
};

const Layout = ({ children }) => {
    const theme: Theme = useTheme();

    useEffect(() => {
        document.body.classList.toggle('index-page');
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle('index-page');
        };
    }, []);

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <IndexNavbar />
            <div className="wrapper">
                <Box sx={{ backgroundColor: theme.palette.background.default }}>{children}</Box>
                {/* <Footer /> */}
            </div>
        </motion.div>
    );
};

export default Layout;
