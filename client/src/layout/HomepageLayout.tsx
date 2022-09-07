import { Box, Theme } from '@mui/material';
import { useTheme } from '@mui/styles';
import TopNavbar from 'components/Navbars/TopNavbar';
import { motion } from 'framer-motion';
import React, { FC, useEffect } from 'react';

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
  topNavPosition?: 'fixed' | 'static';
  enableOnScrollEffect?: boolean;
  disableBackground?: boolean;
}

const Layout: FC<Props> = ({
  children,
  topNavPosition = 'fixed',
  enableOnScrollEffect = true,
  disableBackground = false,
}) => {
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <TopNavbar position={topNavPosition} enableOnScrollEffect={enableOnScrollEffect} />
      <Box
        sx={{
          backgroundColor: !disableBackground && theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </motion.div>
  );
};

export default Layout;
