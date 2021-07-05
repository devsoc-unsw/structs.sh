import Footer from 'components/Footer/Footer.jsx';
import IndexNavbar from 'components/Navbars/TopNavbar.jsx';
import React from 'react';
import { motion } from 'framer-motion';

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
    React.useEffect(() => {
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
                <div className="main">{children}</div>
                {/* <Footer /> */}
            </div>
        </motion.div>
    );
};

export default Layout;
