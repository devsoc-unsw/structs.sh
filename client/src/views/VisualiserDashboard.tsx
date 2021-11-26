import LinkedListAnimation from 'components/Animation/LinkedList/linkedListAnimation';
import GUIMode from 'components/VisualiserController/GUIMode/GuiMode';
import TopNavbar from 'components/Navbars/TopNavbar';
import { Pane } from 'components/Panes';
import Tabs from 'components/Tabs/Tabs';
import { Terminal } from 'components/Terminal';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import styles from './VisualiserDashboard.module.scss';
import Controls from 'components/VisualiserController/Controls/Controls';
import ModeSwitch from 'components/VisualiserController/GUIMode/ModeSwitch';
import { useTheme } from '@mui/material';
import { VisualiserDashboardLayout } from 'layout';
import { VisualiserController } from 'components/VisualiserController';

let appendNode = (_: number) => console.log('Not set');
let deleteNode = (_: number) => console.log('Not set');

const Dashboard = ({ match }) => {
    // Extract route parameters
    const { params } = match;
    const topic = params.topic;

    const theme = useTheme();

    const [terminalMode, setTerminalMode] = useState(true);

    const executeCommand = (command, args) => {
        switch (command) {
            case 'append':
                appendNode(Number(args[0]));
                break;
            case 'delete':
                deleteNode(Number(args[0]));
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

    // Note: this is a hacky way of removing scrolling outside of the panes
    useEffect(() => {
        document.querySelector('html').style.overflow = 'hidden';
        return () => {
            document.querySelector('html').style.overflow = 'auto';
        };
    });

    const handleModeSwitch = () => {
        setTerminalMode(!terminalMode);
    };

    return (
        <VisualiserDashboardLayout topic={topic}>
            <Pane orientation="vertical" minSize={340} topGutterSize={64}>
                <Pane orientation="horizontal" minSize={150.9}>
                    <header
                        className="App-header"
                        style={{ height: '100%', background: 'rgba(225, 225, 225)' }}
                    >
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
                    </header>
                    <div className={styles.interactor}>
                        <VisualiserController
                            terminalMode={terminalMode}
                            setTerminalMode={setTerminalMode}
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
        </VisualiserDashboardLayout>
    );
};

export default Dashboard;
