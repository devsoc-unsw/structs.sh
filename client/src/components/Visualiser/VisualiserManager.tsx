import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Notification } from 'utils/Notification';
import initLinkedListVisualiser from 'visualiser-src/linked-list-visualiser/initialiser';
import { VisualiserController } from './Controller';
import GUIMode from './Controller/GUIMode/GUIMode';
import { Terminal } from './Controller/Terminal';
import styles from './VisualiserDashboard.module.scss';

interface Props {
    topicTitle: string;
}

const VisualiserInterface: React.FC<Props> = ({ topicTitle }) => {
    const [animationProgress, setAnimationProgress] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(0.5);
    const [terminalMode, setTerminalMode] = useState(true);

    const [visualiser, setVisualiser] = useState<any>({});

    /* ------------------------ Visualiser Initialisation ----------------------- */

    useEffect(() => {
        switch (topicTitle) {
            case 'Linked Lists':
                setVisualiser(initLinkedListVisualiser());
                break;
            case 'Binary Search Tree':
                break;
            default:
                Notification.info(`Couldn't find a visualiser to load for '${topicTitle}'`);
        }
    }, [topicTitle]);

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
                    <Terminal executeCommand={executeCommand} topicTitle={topicTitle} />
                ) : (
                    <GUIMode executeCommand={executeCommand} topicTitle={topicTitle} />
                )}
            </Box>
        </Box>
    );
};

export default VisualiserInterface;
