import TimeIcon from '@mui/icons-material/AccessTime';
import PauseIcon from '@mui/icons-material/PauseCircleOutline';
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SpeedIcon from '@mui/icons-material/Speed';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
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
  timelineComplete: boolean;
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
  handleDragTimeline,
  handleSpeedSliderDrag,
  timelineComplete,
  speed,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [userIsDraggingTimeline, setUserIsDraggingTimeline] = useState<boolean>(false);
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const speedMenuOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSpeedMenu = () => {
    setAnchorEl(null);
  };

  const speedOptions: number[] = [1.0, 0.8, 0.6, 0.4, 0.2];
  const [selectedIndex, setSelectedIndex] = useState<number>(2);

  const handleSelectSpeed = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndex(index);
    handleSpeedSliderDrag(speedOptions[index]);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (timelineComplete) {
      setIsPlaying(false);
    } else if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [timelineComplete, handleUpdateTimeline]);

  return (
    <Box
      className={styles.container}
      sx={{ height: '64px', width: '100%', backgroundColor: theme.palette.background.paper }}
    >
      <div className={styles.root}>
        <IconButton onClick={() => handleStepBackward()}>
          <SkipPreviousIcon sx={{ fill: theme.palette.text.primary }} />
        </IconButton>
        {timelineComplete ? (
          <IconButton
            onClick={() => {
              handleDragTimeline(0);
              handlePlay();
              setIsPlaying(true);
            }}
          >
            <ReplayIcon sx={{ fill: theme.palette.text.primary }} />
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

        <Button onClick={handleClick}>
          <SpeedIcon sx={{ fill: theme.palette.text.primary }} />
          <Typography color="textPrimary">{speed}</Typography>
        </Button>
        <Menu
          open={speedMenuOpen}
          anchorEl={anchorEl}
          onClose={handleCloseSpeedMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          {speedOptions.map((speedOption, index) => {
            return (
              <MenuItem onClick={(event) => handleSelectSpeed(event, index)} key={index}>
                {index === selectedIndex ? (
                  <>
                    <ListItemIcon>
                      <CheckIcon sx={{ fill: theme.palette.text.primary }} />
                    </ListItemIcon>
                    {speedOption}
                  </>
                ) : (
                  <ListItemText inset>{speedOption}</ListItemText>
                )}
              </MenuItem>
            );
          })}
        </Menu>

        <Box className={styles.sliderContainer}>
          {/* <Stack direction="column"> */}
          {/* <Stack direction="row" sx={{ height: '32px' }}> */}
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
                    sx={{ ml: '10px' }}
                /> */}
          {/* </Stack> */}
          {/* <Stack direction="row" sx={{ height: '32px' }}>
              {/* <SpeedIcon className={styles.sliderIcon} sx={{ fill: theme.palette.text.primary }} />
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
            </Stack> */}
          {/* </Stack> */}
          {/* </Box> */}

          {/* <Box className={styles.modeSwitchContainer}>
          <ModeSwitch switchMode={terminalMode} setSwitchMode={setTerminalMode} /> */}
        </Box>
        <Button>
          <Typography color="textPrimary">Reset Data Structure</Typography>
        </Button>
      </div>
    </Box>
  );
};

export default VisualiserController;
