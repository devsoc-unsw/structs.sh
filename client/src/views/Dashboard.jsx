import React from 'react';
import Pane from 'components/Panes/Pane';
import { LinkedList } from 'components/Visualisation/LinkedList';
import { Terminal } from 'components/Terminal';
import { motion } from 'framer-motion';
import Tabs from 'components/Tabs/Tabs';
import styles from './Dashboard.module.scss';
import TopNavbar from '../components/Navbars/TopNavbar';
import GUIMode from '../components/GUIMode/guiMode';
import Helmet from 'react-helmet';

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

const Dashboard = ({ match }) => {
    // Extract route parameters
    const { params } = match;
    const topic = params.topic;

    const [switchMode, setSwitchMode] = React.useState(false);

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
            <TopNavbar showMenu />
            <Pane orientation="vertical" minSize={'50%'} topGutterSize={48}>
                <Pane orientation="horizontal" minSize={'50%'}>
                    <LinkedList>Visualiser here</LinkedList>
                    {switchMode || (
                        <GUIMode switchMode={switchMode} setSwitchMode={setSwitchMode} />
                    )}
                    {switchMode && (
                        <Terminal switchMode={switchMode} setSwitchMode={setSwitchMode} />
                    )}
                </Pane>
                <Tabs topic={topic}></Tabs>
            </Pane>
        </motion.div>
    );
};

export default Dashboard;
