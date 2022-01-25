import { Box, Theme, useTheme } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import styles from './VisualiserController.module.scss';
import Controls from './Controls/Controls';

interface Props {
    terminalMode: boolean;
    setTerminalMode: Dispatch<SetStateAction<boolean>>;
    handlePlay: () => void;
    handlePause: () => void;
    handleStepForward: () => void;
    handleStepBackward: () => void;
    handleUpdateTimeline: (val: number) => void;
    handleDragTimeline: (val: number) => void;
    handleSpeedSliderDrag: (val: number) => void;
    timelineComplete: boolean;
    speed: number;
}

const VisualiserController: React.FC<Props> = ({
    terminalMode,
    setTerminalMode,
    handlePlay,
    handlePause,
    handleStepForward,
    handleStepBackward,
    handleUpdateTimeline,
    handleDragTimeline,
    handleSpeedSliderDrag,
    timelineComplete,
    speed,
}) => {
    const theme: Theme = useTheme();

    return (
        <Box
            className={styles.container}
            sx={{ height: '64px', width: '100%', backgroundColor: theme.palette.background.paper }}
        >
            <Controls
                terminalMode={terminalMode}
                setTerminalMode={setTerminalMode}
                handlePlay={handlePlay}
                handlePause={handlePause}
                handleStepForward={handleStepForward}
                handleStepBackward={handleStepBackward}
                handleUpdateTimeline={handleUpdateTimeline}
                handleDragTimeline={handleDragTimeline}
                handleSpeedSliderDrag={handleSpeedSliderDrag}
                timelineComplete={timelineComplete}
                speed={speed}
            />
        </Box>
    );
};

export default VisualiserController;
