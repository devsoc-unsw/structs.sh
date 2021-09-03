// import { appendNode, deleteNode } from 'components/Visualisation/LinkedList/LinkedListJoanna';
import LinkedListAnimation from 'components/Animation/LinkedList/linkedListAnimation';
import GUIMode from 'components/GUIMode/guiMode';
import TopNavbar from 'components/Navbars/TopNavbar';
import { Pane } from 'components/Panes';
import Tabs from 'components/Tabs/Tabs';
import { Terminal } from 'components/Terminal';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import styles from './Dashboard.module.scss';
import Controls from 'components/Controls/Controls';
import ModeSwitch from 'components/GUIMode/modeSwitch';

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
let appendNode = () => console.log('Not set');
let deleteNode = () => console.log('Not set');
console.log('STARTING');

const Dashboard = ({ match }) => {
    // Extract route parameters
    const { params } = match;
    const topic = params.topic;

    const [terminalMode, setTerminalMode] = useState(true);

    const executeCommand = (command, args) => {
        switch (command) {
            case 'append':
                appendNode(parseInt(args[0]));
                break;
            case 'delete':
                deleteNode(parseInt(args[0]));
                break;
            default:
                return `Invalid command: ${command}`;
        }
    };

    useEffect(() => {
        const list = new LinkedListAnimation();
        appendNode = list.animateAppend.bind(list);
        deleteNode = list.animateDelete.bind(list);
    }, []);

    const handleModeSwitch = () => {
        setTerminalMode(!terminalMode)
    }

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
            <Pane orientation="vertical" minSize={340} topGutterSize={48} >
                <Pane orientation="horizontal" minSize={150.9}>
                    {/* <LinkedList /> */}
                    <header classname="App-header">
                        <div className="visualiser">
                            <svg
                                className="visualiser-svg"
                                overflow="auto"
                                style={{ width: '100%' }}
                            >
                                <g className="nodes" transform="translate(0, 20)" />
                                <g className="pointers" transform="translate(0, 20)" />
                            </svg>
                        </div>
                        <Controls />
                    </header>
                    <div className={styles.interactor}>
                        <ModeSwitch
                            onClick={handleModeSwitch}
                            switchMode={terminalMode}
                            setSwitchMode={setTerminalMode}
                        />
                        {terminalMode ? (
                            <Terminal executeCommand={executeCommand} />
                        ) : (
                            <GUIMode executeCommand={executeCommand} />
                        )}
                    </div>
                </Pane>
                <Tabs topic={topic}></Tabs>
            </Pane>
        </motion.div>
    );
};

export default Dashboard;
