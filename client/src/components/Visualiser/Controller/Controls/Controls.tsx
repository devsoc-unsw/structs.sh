import TimeIcon from '@mui/icons-material/AccessTime';
import PauseIcon from '@mui/icons-material/PauseCircleOutline';
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SpeedIcon from '@mui/icons-material/Speed';
import {
  Box, IconButton, Stack, useTheme,
} from '@mui/material';
import Slider from '@mui/material/Slider';
import React, { FC, useEffect, useState } from 'react';
import ModeSwitch from '../GUIMode/ModeSwitch';
import styles from './Control.module.scss';

interface Props {
  terminalMode: boolean;
  setTerminalMode: (mode: boolean) => void;
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

const Controls: FC<Props> = ({
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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [userIsDraggingTimeline, setUserIsDraggingTimeline] = useState<boolean>(false);
  const theme = useTheme();

  useEffect(() => {
    if (timelineComplete) {
      setIsPlaying(false);
    } else if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [timelineComplete, handleUpdateTimeline]);

  return (
    <div className={styles.root}>
      <IconButton>
        <SkipPreviousIcon
          onClick={() => {
            handleStepBackward();
            setIsPlaying(false);
          }}
          sx={{ fill: theme.palette.text.primary }}
        />
      </IconButton>
      {timelineComplete ? (
        <IconButton>
          <ReplayIcon
            sx={{ fill: theme.palette.text.primary }}
            onClick={() => {
              handleDragTimeline(0);
              handlePlay();
              setIsPlaying(true);
            }}
          />
        </IconButton>
      ) : isPlaying ? (
        <IconButton>
          <PauseIcon
            onClick={() => {
              handlePause();
              setIsPlaying(false);
            }}
            sx={{ fill: theme.palette.text.primary }}
          />
        </IconButton>
      ) : (
        <IconButton>
          <PlayIcon
            onClick={() => {
              handlePlay();
              setIsPlaying(true);
            }}
            sx={{ fill: theme.palette.text.primary }}
          />
        </IconButton>
      )}
      <IconButton>
        <SkipNextIcon
          onClick={() => {
            handleStepForward();
            setIsPlaying(false);
          }}
          sx={{ fill: theme.palette.text.primary }}
        />
      </IconButton>

      <Box className={styles.sliderContainer}>
        <Stack direction="column">
          <Stack direction="row" sx={{ height: '32px' }}>
            <TimeIcon
              className={styles.sliderIcon}
              sx={{ fill: theme.palette.text.primary }}
            />
            <input
              type="range"
              id="timelineSlider"
              name="volume"
              min="0"
              max="100"
              defaultValue="0"
              step="0.01"
              className={styles.timelineSlider}
              onChange={(event) => {
                if (userIsDraggingTimeline) {
                  handleDragTimeline(Number(event.target.value));
                } else {
                  handleUpdateTimeline(Number(event.target.value));
                }
              }}
              onMouseDown={() => {
                setUserIsDraggingTimeline(true);
                handlePause();
              }}
              onMouseUp={() => {
                setUserIsDraggingTimeline(false);
                if (isPlaying) {
                  handlePlay();
                }
              }}
            />
            {/* <Slider
                            onChange={(_, newValue) => {
                                if (userIsDraggingTimeline) {
                                    handleDragTimeline(Number(newValue));
                                } else {
                                    handleUpdateTimeline(Number(newValue));
                                }
                            }}
                            onMouseDown={() => {
                                setUserIsDraggingTimeline(true);
                                handlePause();
                            }}
                            onMouseUp={() => {
                                setUserIsDraggingTimeline(false);
                                handlePlay();
                            }}
                            value={animationProgress}
                            disabled={!isPlaying}
                            min={0}
                            max={100}
                            step={0.001}
                            sx={{ ml: '10px' }}
                        /> */}
          </Stack>
          <Stack direction="row" sx={{ height: '32px' }}>
            <SpeedIcon
              className={styles.sliderIcon}
              sx={{ fill: theme.palette.text.primary }}
            />
            <Slider
              onChange={(_, newValue) => handleSpeedSliderDrag(Number(newValue))}
              onMouseDown={() => handlePause()}
              onMouseUp={() => handlePlay()}
              value={speed}
              min={0.20}
              max={1}
              step={0.2}
              marks
              sx={{ ml: '10px' }}
              color="secondary"
            />
          </Stack>
        </Stack>
      </Box>

      <Box className={styles.modeSwitchContainer}>
        <ModeSwitch switchMode={terminalMode} setSwitchMode={setTerminalMode} />
      </Box>
    </div>
  );
};

export default Controls;
