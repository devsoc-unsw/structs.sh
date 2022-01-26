import { Box } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Notification } from 'utils/Notification';
import initLinkedListVisualiser from 'visualiser-src/linked-list-visualiser/initialiser';
import initBSTVisualiser from 'visualiser-src/binary-search-tree-visualiser/initialiser';
import { VisualiserController } from './Controller';
import GUIMode from './Controller/GUIMode/GUIMode';
import { Terminal } from './Controller/Terminal';
import styles from './VisualiserDashboard.module.scss';
import { getCommandExecutor } from './executableCommands';

interface Props {
    topicTitle: string;
}

const VisualiserInterface: React.FC<Props> = ({ topicTitle }) => {
    const [timelineComplete, setTimelineComplete] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(0.6);
    const [terminalMode, setTerminalMode] = useState(true);

    const [visualiser, setVisualiser] = useState<any>({});

    /* ------------------------ Visualiser Initialisation ----------------------- */

    useEffect(() => {
        switch (topicTitle) {
            case 'Linked Lists':
                setVisualiser(initLinkedListVisualiser());
                break;
            case 'Binary Search Trees':
                setVisualiser(initBSTVisualiser());
                break;
            default:
                Notification.info(`Couldn't find a visualiser to load for '${topicTitle}'`);
        }
    }, [topicTitle]);

    /* -------------------------- Visualiser Callbacks -------------------------- */

    const updateTimeline = useCallback((val) => {
        const timelineSlider = document.querySelector('#timelineSlider') as HTMLInputElement;
        timelineSlider.value = String(val);

        setTimelineComplete(val >= 100);
    }, []);

    const executeCommand = useMemo(
        () => getCommandExecutor(topicTitle, visualiser, updateTimeline),
        [topicTitle, visualiser, updateTimeline]
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
                timelineComplete={timelineComplete}
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
