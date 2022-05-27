import TimeIcon from '@mui/icons-material/AccessTime';
import PauseIcon from '@mui/icons-material/PauseCircleOutline';
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SpeedIcon from '@mui/icons-material/Speed';
import { Box, IconButton, Stack, useTheme } from '@mui/material';
import Slider from '@mui/material/Slider';
import React, { EventHandler, FC, useCallback, useContext, useEffect, useState } from 'react';
import { defaultSpeed } from 'visualiser-src/common/constants';
import VisualiserContext from '../VisualiserContext';
import styles from './Control.module.scss';

/**
 * Contains all the visualiser controller UI, ie. the play/pause buttons, the
 * sliders, etc.
 *
 * It receives a bunch of callbacks and connects it to each of the corresponding
 * UI components.
 *
 * Eg. it receives a `handlePlay` callback and attaches it to the Play button's
 *     `onClick` handler.
 */
const VisualiserControls = () => {
  const {
    controller,
    timeline: { isTimelineComplete, handleTimelineUpdate },
  } = useContext(VisualiserContext);
  const [speed, setSpeed] = useState<number>(defaultSpeed);

  const handlePlay = useCallback(() => {
    controller.play();
  }, [controller]);

  const handlePause = useCallback(() => {
    controller.pause();
  }, [controller]);

  const handleStepForward = useCallback(() => {
    controller.stepForwards();
  }, [controller]);

  const handleStepBackward = useCallback(() => {
    controller.stepBackwards();
  }, [controller]);

  const handleDragTimeline = useCallback(
    (val: number) => {
      controller.seekPercent(val);
    },
    [controller]
  );

  const handleSpeedSliderDrag = useCallback(
    (val: number) => {
      controller.setSpeed(val);
      setSpeed(val);
    },
    [controller]
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [userIsDraggingTimeline, setUserIsDraggingTimeline] = useState<boolean>(false);
  const theme = useTheme();

  useEffect(() => {
    if (isTimelineComplete) {
      setIsPlaying(false);
    } else if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [isTimelineComplete, handleTimelineUpdate]);

  return (
    <Box
      className={styles.container}
      sx={{ height: '64px', width: '100%', backgroundColor: theme.palette.background.paper }}
    >
      <div className={styles.root}>
        <IconButton onClick={() => handleStepBackward()}>
          <SkipPreviousIcon sx={{ fill: theme.palette.text.primary }} />
        </IconButton>
        {isTimelineComplete ? (
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
          <IconButton
            onClick={() => {
              handlePause();
              setIsPlaying(false);
            }}
          >
            <PauseIcon sx={{ fill: theme.palette.text.primary }} />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              handlePlay();
              setIsPlaying(true);
            }}
          >
            <PlayIcon sx={{ fill: theme.palette.text.primary }} />
          </IconButton>
        )}
        <IconButton onClick={() => handleStepForward()}>
          <SkipNextIcon sx={{ fill: theme.palette.text.primary }} />
        </IconButton>

        <Box className={styles.sliderContainer}>
          <Stack direction="column">
            <Stack direction="row" sx={{ height: '32px' }}>
              <TimeIcon className={styles.sliderIcon} sx={{ fill: theme.palette.text.primary }} />
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
                    handleTimelineUpdate(Number(event.target.value));
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
            </Stack>
            <Stack direction="row" sx={{ height: '32px' }}>
              <SpeedIcon className={styles.sliderIcon} sx={{ fill: theme.palette.text.primary }} />
              <Slider
                onChange={(_, newValue) => handleSpeedSliderDrag(Number(newValue))}
                onMouseDown={() => handlePause()}
                onMouseUp={() => handlePlay()}
                value={speed}
                min={0.2}
                max={1}
                step={0.2}
                marks
                sx={{ ml: '10px' }}
                color="secondary"
              />
            </Stack>
          </Stack>
        </Box>
      </div>
    </Box>
  );
};

export default VisualiserControls;
