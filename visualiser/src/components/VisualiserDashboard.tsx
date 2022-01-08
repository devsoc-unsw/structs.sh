import { Box, Theme, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CircularLoader } from 'components/Loader';
import { Pane } from 'components/Panes';
import Tabs from 'components/Tabs/Tabs';
import { VisualiserController } from 'components/Visualisation/Controller';
import GUIMode from 'components/Visualisation/Controller/GUIMode/GUIMode';
import { Terminal } from 'components/Visualisation/Controller/Terminal';
import { VisualiserDashboardLayout } from 'layout';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopic, Topic } from 'utils/apiRequests';
import { Notification } from 'utils/Notification';
import { urlToTitle } from 'utils/url';
import curr from './assets/curr.svg';
import prev from './assets/prev.svg';
// TODO: REARRANGE DIR
import initialiseVisualiser from './linked-list-visualiser/initialiser';
import { topOffset } from './linked-list-visualiser/util/constants';
import './styles/visualiser.css';
import styles from './VisualiserDashboard.module.scss';

interface Props {}

const VisualiserDashboard: FC<Props> = () => {
    const [topic, setTopic] = useState<Topic>();
    const [animationProgress, setAnimationProgress] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(0.5);
    const [terminalMode, setTerminalMode] = useState(true);

    const [visualiser, setVisualiser] = useState<any>({});

    const theme: Theme = useTheme();
    const isAboveMdWidth = useMediaQuery(theme.breakpoints.up('md'));

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
        setVisualiser(initialiseVisualiser());
    }, []);

    /* -------------------------- Visualiser Callbacks -------------------------- */

    const updateTimeline = useCallback((val) => {
        setAnimationProgress(val);
    }, []);

    const executeCommand = useCallback(
        (command: string, args: string[]): string => {
            switch (command) {
                case 'append':
                    if (!args || args.length !== 1) {
                        return 'Invalid input';
                    } else {
                        // appendNode(Number(args[0]));
                        visualiser.appendNode(Number(args[0]), updateTimeline);
                        return '';
                    }
                case 'delete':
                    if (!args || args.length !== 1) {
                        return 'Invalid input';
                    } else {
                        visualiser.deleteNode(Number(args[0]), updateTimeline);
                        return '';
                    }
                case 'insert':
                    console.log(args);
                    if (!args || args.length !== 2) {
                        return 'Invalid input';
                    } else {
                        visualiser.insertNode(Number(args[0]), Number(args[1]), updateTimeline);
                        return '';
                    }
                case 'search':
                    if (!args || args.length !== 1) {
                        return 'Invalid input';
                    } else {
                        visualiser.searchList(Number(args[0]), updateTimeline);
                        return '';
                    }
                default:
                    return `Invalid command: ${command}`;
            }
        },
        [visualiser, updateTimeline]
    );

    const handlePlay = useCallback(() => {
        visualiser.play();
    }, [visualiser]);

    const handlePause = useCallback(() => {
        visualiser.pause();
    }, [visualiser]);

    const handleStepForward = useCallback(() => {
        visualiser.stepForward();
    }, [visualiser]);

    const handleStepBackward = useCallback(() => {
        visualiser.stepBack();
    }, [visualiser]);

    const dragTimeline = useCallback(
        (val: number) => {
            visualiser.setTimeline(val);
            setAnimationProgress(val);
        },
        [visualiser]
    );

    const handleSpeedSliderDrag = useCallback(
        (val: number) => {
            visualiser.setSpeed(val);
            setSpeed(val);
        },
        [visualiser]
    );

    const handleSpeedSliderDragEnd = useCallback(() => {
        visualiser.onFinishSetSpeed();
    }, [visualiser]);

    /* -------------------------------------------------------------------------- */

    return (
        <VisualiserDashboardLayout topic={topic}>
            {isAboveMdWidth ? (
                <Pane orientation="vertical" minSize={340} hasTopGutter>
                    <Pane orientation="horizontal" minSize={150.9}>
                        <header
                            style={{
                                height: '100%',
                                padding: '10px',
                                background: 'rgba(235, 235, 235)',
                            }}
                        >
                            <div className="container">
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
                                handleUpdateTimeline={updateTimeline}
                                handleDragTimeline={dragTimeline}
                                handleSpeedSliderDrag={handleSpeedSliderDrag}
                                handleSpeedSliderDragEnd={handleSpeedSliderDragEnd}
                                animationProgress={animationProgress}
                                speed={speed}
                            />
                            <Box sx={{ height: '100%' }}>
                                {terminalMode ? (
                                    <Terminal executeCommand={executeCommand} topic={topic} />
                                ) : (
                                    <GUIMode executeCommand={executeCommand} topic={topic} />
                                )}
                            </Box>
                        </Box>
                    </Pane>
                    {topic ? <Tabs topic={topic}></Tabs> : <CircularLoader />}
                </Pane>
            ) : (
                <Pane orientation="horizontal">
                    <header
                        style={{
                            height: 'calc(100% - 64px)',
                            marginTop: '64px',
                            padding: '10px',
                            background: 'rgba(235, 235, 235)',
                        }}
                    >
                        <div className="container">
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
                            handleUpdateTimeline={updateTimeline}
                            handleDragTimeline={dragTimeline}
                            handleSpeedSliderDrag={handleSpeedSliderDrag}
                            handleSpeedSliderDragEnd={handleSpeedSliderDragEnd}
                            animationProgress={animationProgress}
                            speed={speed}
                        />
                        <Box sx={{ height: '100%' }}>
                            {terminalMode ? (
                                <Terminal executeCommand={executeCommand} topic={topic} />
                            ) : (
                                <GUIMode executeCommand={executeCommand} topic={topic} />
                            )}
                        </Box>
                    </Box>
                </Pane>
            )}
        </VisualiserDashboardLayout>
    );
};

export default VisualiserDashboard;
