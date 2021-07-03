import { Pane } from 'components/Panes';
import Tabs from 'components/Tabs/Tabs';
import { Terminal } from 'components/Terminal';
import { LinkedList } from 'components/Visualisation/LinkedList';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import Helmet from 'react-helmet';
import TopNavbar from 'components/Navbars/TopNavbar';
import styles from './Dashboard.module.scss';
import GUIMode from 'components/GUIMode/guiMode';
import { appendNode, deleteNode } from 'components/Visualisation/LinkedList/LinkedListJoanna';

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

    const [terminalMode, setTerminalMode] = useState(true);

    const executeCommand = (command, args) => {
        alert(`Executing ${command} with args: ${args}`);
        switch (command) {
            case 'append':
                appendNode(args[0]);
                break;
            case 'delete':
                break;
        }
    };

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

            {/* For some reason, getting rid of this ruins the pane spacing. It can't be a div or a span... */}
            <img width={48} height={48} />
            <TopNavbar showMenu />
            <Pane orientation="vertical" minSize={'50%'} topGutterSize={48}>
                <Pane orientation="horizontal" minSize={'50%'}>
                    <LinkedList>Visualiser here</LinkedList>
                    {terminalMode ? (
                        <Terminal
                            switchMode={terminalMode}
                            setSwitchMode={setTerminalMode}
                            executeCommand={executeCommand}
                        />
                    ) : (
                        <GUIMode
                            switchMode={terminalMode}
                            setSwitchMode={setTerminalMode}
                            executeCommand={executeCommand}
                        />
                    )}
                </Pane>
                <Tabs topic={topic}></Tabs>
            </Pane>
        </motion.div>
    );
};

export default Dashboard;
