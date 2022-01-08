import { Box } from '@mui/material';
import { VisualiserController } from './Controller';
import GUIMode from './Controller/GUIMode/GUIMode';
import { Terminal } from './Controller/Terminal';
import React, { useCallback, useEffect, useState } from 'react';
import { Topic } from 'utils/apiRequests';
import initialiseVisualiser from 'visualiser/linked-list-visualiser/initialiser';
import styles from './VisualiserDashboard.module.scss';

interface Props {
    topic: Topic;
}

const VisualiserInterface: React.FC<Props> = ({ topic }) => {
    const [animationProgress, setAnimationProgress] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(0.5);
    const [terminalMode, setTerminalMode] = useState(true);

    const [visualiser, setVisualiser] = useState<any>({});

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
    );
};

export default VisualiserInterface;
