import { motion } from 'framer-motion';
import React, { FC, useEffect } from 'react';
import Helmet from 'react-helmet';
import TopNavbar from 'components/Navbars/TopNavbar';
import { Theme } from '@mui/material';
import { useTheme } from '@mui/styles';
import Box from '@mui/material/Box';
import { DataStructure } from 'visualiser-src/common/typedefs';
import { toTitleCase } from 'utils/url';
import styles from './VisualiserDashboardLayout.module.scss';

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
  topicTitle: DataStructure;
}

const VisualiserDashboardLayout: FC<Props> = ({ children, topicTitle }) => {
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
        <title>{topicTitle !== undefined ? toTitleCase(topicTitle) : 'Structs.sh'}</title>
      </Helmet>
      <TopNavbar position="relative" enableOnScrollEffect={false} />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          height: 'calc(100vh - 64px)',
          width: '100vw',
        }}
      >
        {children}
      </Box>
    </motion.div>
  );
};

export default VisualiserDashboardLayout;
