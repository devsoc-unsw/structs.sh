import React from 'react';
import { LineLoader } from 'components/Loader';
import TopNavbar from 'components/Navbars/TopNavbar';
import { Visualiser } from 'components/Visualiser';
import { motion } from 'framer-motion';
import Helmet from 'react-helmet';
import { useParams } from 'react-router-dom';
import { toTitleCase, urlToTitle } from 'utils/url';
import 'visualiser-src/linked-list-visualiser/styles/visualiser.css';

import styles from './VisualiserDashboard.module.scss';

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

/**
 * Defines the layout and contents of the visualiser pages.
 * Notably, we're using a split-pane layout here.
 */
const VisualiserDashboard = () => {
  const topic = toTitleCase(urlToTitle(useParams().topic));

  return topic ? (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Helmet>
        <title>{topic !== undefined ? topic : 'Structs.sh'}</title>
      </Helmet>

      <TopNavbar position="static" />
      <Visualiser topicTitle={topic} />
    </motion.div>
  ) : (
    <LineLoader fullViewport />
  );
};

export default VisualiserDashboard;
