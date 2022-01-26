import TimeIcon from '@mui/icons-material/AccessTime';
import PauseIcon from '@mui/icons-material/PauseCircleOutline';
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SpeedIcon from '@mui/icons-material/Speed';
import { Box, IconButton, Stack, useTheme } from '@mui/material';
import Slider from '@mui/material/Slider';
import React, { FC, useEffect, useState } from 'react';
import ModeSwitch from './GUIMode/ModeSwitch';
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
  handleSpeedSliderDragEnd: () => void;
  animationProgress: number;
  speed: number;
}

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
const VisualiserController: FC<Props> = ({
  terminalMode,
  setTerminalMode,
  handlePlay,
  handlePause,
  handleStepForward,
  handleStepBackward,
  handleUpdateTimeline,
  //   handleDragTimeline,
  handleSpeedSliderDrag,
  handleSpeedSliderDragEnd,
  animationProgress,
  speed,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  //   const [userIsDraggingTimeline, setUserIsDraggingTimeline] = useState<boolean>(false);
  const theme = useTheme();

  useEffect(() => {
    if (animationProgress >= 100) {
      setIsPlaying(false);
      handleUpdateTimeline(0);
    } else if (animationProgress > 0 && animationProgress < 100) {
      if (!isPlaying) {
        setIsPlaying(true);
      }
    }
  }, [animationProgress, handleUpdateTimeline, isPlaying]);

  return (
    <Box
      className={styles.container}
      sx={{ height: '64px', width: '100%', backgroundColor: theme.palette.background.paper }}
    >
      <div className={styles.root}>
        <IconButton>
          <SkipPreviousIcon
            onClick={() => handleStepBackward()}
            sx={{ fill: theme.palette.text.primary }}
          />
        </IconButton>
        {isPlaying ? (
          <IconButton>
            <PauseIcon
              onClick={() => {
                handlePause();
                setIsPlaying(false);
              }}
              sx={{ fill: theme.palette.text.primary }}
            />
          </IconButton>
        ) : animationProgress > 0 && animationProgress <= 100 ? (
          <IconButton>
            <PlayIcon
              onClick={() => {
                handlePlay();
                setIsPlaying(true);
              }}
              sx={{ fill: theme.palette.text.primary }}
            />
          </IconButton>
        ) : (
          <IconButton>
            <ReplayIcon
              sx={{ fill: theme.palette.text.primary }}
              onClick={() => {
                handlePlay();
                setIsPlaying(true);
              }}
            />
          </IconButton>
        )}
        <IconButton>
          <SkipNextIcon
            onClick={() => handleStepForward()}
            sx={{ fill: theme.palette.text.primary }}
          />
        </IconButton>

        <Box className={styles.sliderContainer}>
          <Stack direction="column">
            <Stack direction="row" sx={{ height: '32px' }}>
              <TimeIcon className={styles.sliderIcon} sx={{ fill: theme.palette.text.primary }} />
              <div className="col">
                <input
                  type="range"
                  id="timelineSlider"
                  name="volume"
                  min="0"
                  max="100"
                  defaultValue="0"
                  step="0.01"
                />
              </div>
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
                    sx={{ ml: '10px' }}
                /> */}
            </Stack>
            <Stack direction="row" sx={{ height: '32px' }}>
              <SpeedIcon className={styles.sliderIcon} sx={{ fill: theme.palette.text.primary }} />
              <Slider
                onChange={(_, newValue) => handleSpeedSliderDrag(Number(newValue))}
                onMouseUp={() => {
                  if (animationProgress > 0) {
                    handleSpeedSliderDragEnd();
                  }
                }}
                value={speed}
                min={0}
                max={1}
                step={0.1}
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
    </Box>
  );
};

export default VisualiserController;
