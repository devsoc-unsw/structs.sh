import { Box } from '@mui/material';
import LinkedListAnimation from 'components/Animation/LinkedList/linkedListAnimation';
import { CircularLoader } from 'components/Loader';
import { Pane } from 'components/Panes';
import Tabs from 'components/Tabs/Tabs';
import { Terminal } from 'components/Terminal';
import { VisualiserController } from 'components/Visualisation/Controller';
import GUIMode from 'components/Visualisation/Controller/ModeSwitch/GUIMode';
import { VisualiserDashboardLayout } from 'layout';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopic, Topic } from 'utils/apiRequests';
import { Notification } from 'utils/Notification';
import { urlToTitle } from 'utils/url';
import styles from './VisualiserDashboard.module.scss';

// TODO: REARRANGE DIR
import initialiseVisualiser from './linked-list-visualiser/initialiser';
import './styles/visualiser.css';
import prev from './assets/prev.svg';
import curr from './assets/curr.svg';
import { topOffset, defaultSpeed } from './linked-list-visualiser/util/constants';

let appendNode = (_: number) => console.log('Not set');
let deleteNode = (_: number) => console.log('Not set');

const Dashboard = () => {
    const [topic, setTopic] = useState<Topic>();
    const [animationProgress, setAnimationProgress] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(50);
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
        initialiseVisualiser();
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

    const handleAnimationProgressSliderDrag = useCallback((val) => {
        Notification.info(`Timeline slider dragged to ${val} out of 100`);

        setAnimationProgress(val);
    }, []);

    const handleSpeedSliderDrag = useCallback((val) => {
        Notification.info(`Speed slider dragged to ${val} out of 100`);

        setSpeed(val);
    }, []);

    /* -------------------------------------------------------------------------- */

    return (
        <VisualiserDashboardLayout topic={topic}>
            <Pane orientation="vertical" minSize={340} topGutterSize={64}>
                <Pane orientation="horizontal" minSize={150.9}>
                    <header style={{ height: '100%', background: 'rgba(235, 235, 235)' }}>
                        <div className="container">
                            <form className="row g-3">
                                <div className="col-auto">
                                    <input id="inputValue" type="text" className="form-control" />
                                    <input
                                        id="altInputValue"
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-auto">
                                    <button
                                        id="appendButton"
                                        type="submit"
                                        className="btn btn-primary mb-3"
                                    >
                                        Add Node!
                                    </button>
                                </div>
                                <div className="col-auto">
                                    <button
                                        id="deleteButton"
                                        type="submit"
                                        className="btn btn-danger mb-3"
                                    >
                                        Delete Node!
                                    </button>
                                </div>
                                <div className="col-auto">
                                    <button
                                        id="searchButton"
                                        type="submit"
                                        className="btn btn-danger mb-3"
                                    >
                                        Search by Value!
                                    </button>
                                </div>
                                <div className="col-auto">
                                    <button
                                        id="insertButton"
                                        type="submit"
                                        className="btn btn-danger mb-3"
                                    >
                                        Insert Value By Position!
                                    </button>
                                </div>
                                <div className="col-auto">
                                    <button
                                        id="playButton"
                                        type="submit"
                                        className="btn btn-primary mb-3"
                                    >
                                        Play
                                    </button>
                                </div>
                                <div className="col-auto">
                                    <button
                                        id="pauseButton"
                                        type="submit"
                                        className="btn btn-primary mb-3"
                                    >
                                        Pause
                                    </button>
                                </div>
                                <div className="col-auto">
                                    <button
                                        id="previousSequenceButton"
                                        type="submit"
                                        className="btn btn-primary mb-3"
                                    >
                                        Undo
                                    </button>
                                </div>
                                <div className="col-auto">
                                    <button
                                        id="nextSequenceButton"
                                        type="submit"
                                        className="btn btn-primary mb-3"
                                    >
                                        Redo
                                    </button>
                                </div>
                                <div className="col">
                                    Timeline
                                    <input
                                        type="range"
                                        id="timeline-slider"
                                        name="volume"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="col">
                                    Speed
                                    <input
                                        type="range"
                                        id="speed-slider"
                                        name="volume"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        defaultValue={defaultSpeed}
                                    />
                                </div>
                            </form>
                            <div className="container" id="canvas">
                                <div id="current" style={{ top: `${topOffset}px` }}>
                                    <img src={curr} alt="curr arrow" />
                                </div>
                                <div id="prev" style={{ top: `${topOffset}px` }}>
                                    <img src={prev} alt="prev arrow" />
                                </div>
                            </div>
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
                            handleAnimationProgressSliderDrag={handleAnimationProgressSliderDrag}
                            handleSpeedSliderDrag={handleSpeedSliderDrag}
                            animationProgress={animationProgress}
                            speed={speed}
                        />
                        {terminalMode ? (
                            <Terminal executeCommand={executeCommand} topic={topic} />
                        ) : (
                            <GUIMode executeCommand={executeCommand} topic={topic} />
                        )}
                    </Box>
                </Pane>
                {topic ? <Tabs topic={topic}></Tabs> : <CircularLoader />}
            </Pane>
        </VisualiserDashboardLayout>
    );
};

export default Dashboard;
