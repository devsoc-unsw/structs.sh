import React, { FC, useEffect } from 'react';
import { Box, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { TopNavbar } from 'components/Navbars';
import Footer from 'components/Footer';

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

// TODO: check if it's fine for children to be required
interface Props {
  children: React.ReactNode;
}

/**
 * The layout for general pages
 */
const PageLayout: FC<Props> = ({ children }) => {
  const theme: Theme = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.toggle('index-page');
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle('index-page');
    };
  }, []);

  return (
    <>
      <TopNavbar />
      <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
        <Box bgcolor={theme.palette.primary.main}>{children}</Box>
      </motion.div>
      <Footer />
    </>
  );
};

export default PageLayout;
