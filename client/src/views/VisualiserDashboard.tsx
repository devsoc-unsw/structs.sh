import { Box } from '@mui/material';
import LinkedListAnimation from 'components/Animation/LinkedList/linkedListAnimation';
import { CircularLoader } from 'components/Loader';
import { Pane } from 'components/Panes';
import Tabs from 'components/Tabs/Tabs';
import { Terminal } from 'components/Terminal';
import { VisualiserController } from 'components/Visualisation/Controller';
import GUIMode from 'components/Visualisation/Controller/ModeSwitch/GuiMode';
import { VisualiserDashboardLayout } from 'layout';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopic, Topic } from 'utils/apiRequests';
import { Notification } from 'utils/Notification';
import { urlToTitle } from 'utils/url';
import styles from './VisualiserDashboard.module.scss';

let appendNode = (_: number) => console.log('Not set');
let deleteNode = (_: number) => console.log('Not set');

const Dashboard = () => {
    const [topic, setTopic] = useState<Topic>();
    const [animationProgress, setAnimationProgress] = useState<number>(0);
    const [terminalMode, setTerminalMode] = useState(true);

    const params = useParams();

    // Fetching the topic based on the URL parameter in `/visualiser/:topic`
    useEffect(() => {
        const topicTitleInUrl = params.topic;
        getTopic(urlToTitle(topicTitleInUrl))
            .then((topic) => setTopic(topic))
            .catch(() => Notification.error('Visualiser Dashboard: Failed to get topic'));
    }, [params]);

    // Note: this is a hacky way of removing scrollability outside of the panes
    useEffect(() => {
        document.querySelector('html').style.overflow = 'hidden';
        return () => {
            document.querySelector('html').style.overflow = 'auto';
        };
    });

    /* ------------------------ Visualiser Initialisation ----------------------- */

    useEffect(() => {
        const list = new LinkedListAnimation();
        appendNode = list.animateAppend.bind(list);
        deleteNode = list.animateDelete.bind(list);
    }, []);

    /* -------------------------- Visualiser Callbacks -------------------------- */

    const executeCommand = useCallback((command, args): string => {
        switch (command) {
            case 'append':
                if (!args || args.length !== 1) {
                    return 'Invalid input';
                } else {
                    appendNode(Number(args[0]));
                    return '';
                }
            case 'delete':
                if (!args || args.length !== 1) {
                    return 'Invalid input';
                } else {
                    deleteNode(Number(args[0]));
                    return '';
                }
            default:
                return `Invalid command: ${command}`;
        }
    }, []);

    const handlePlay = useCallback(() => {
        Notification.info('Playing');

        setInterval(() => {
            setAnimationProgress((old) => old + 2);
        }, 1000);
    }, []);

    const handlePause = useCallback(() => {
        Notification.info('Pausing');
    }, []);

    const handleStepForward = useCallback(() => {
        Notification.info('Stepping forward');
    }, []);

    const handleStepBackward = useCallback(() => {
        Notification.info('Stepping backward');
    }, []);

    const handleSliderDrag = useCallback((val) => {
        Notification.info(`Dragged slider to ${val} out of 100`);
        setAnimationProgress(val);
    }, []);

    /* -------------------------------------------------------------------------- */

    return (
        <VisualiserDashboardLayout topic={topic}>
            <Pane orientation="vertical" minSize={340} topGutterSize={64}>
                <Pane orientation="horizontal" minSize={150.9}>
                    <header style={{ height: '100%', background: 'rgba(235, 235, 235)' }}>
                        {/* TODO: Place the new visualiser canvas here */}
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
                    <Box className={styles.interactor}>
                        <VisualiserController
                            terminalMode={terminalMode}
                            setTerminalMode={setTerminalMode}
                            handlePlay={handlePlay}
                            handlePause={handlePause}
                            handleStepForward={handleStepForward}
                            handleStepBackward={handleStepBackward}
                            handleSliderDrag={handleSliderDrag}
                            animationProgress={animationProgress}
                        />
                        {terminalMode ? (
                            <Terminal executeCommand={executeCommand} />
                        ) : (
                            <GUIMode executeCommand={executeCommand} />
                        )}
                    </Box>
                </Pane>
                {topic ? <Tabs topic={topic}></Tabs> : <CircularLoader />}
            </Pane>
        </VisualiserDashboardLayout>
    );
};

export default Dashboard;
