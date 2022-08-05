import TimeIcon from '@mui/icons-material/AccessTime';
import PauseIcon from '@mui/icons-material/PauseCircleOutline';
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
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
    timeline: { isTimelineComplete, handleTimelineUpdate, isPlaying, handleUpdateIsPlaying },
  } = useContext(VisualiserContext);
  const [userIsDraggingTimeline, setUserIsDraggingTimeline] = useState<boolean>(false);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(2);
  const speedMenuOpen = Boolean(anchorEl);
  const speedOptions: string[] = ['1.0', '0.8', '0.6', '0.4', '0.2'];

  const handlePlay = useCallback(() => {
    controller.play();
    handleUpdateIsPlaying(true);
  }, [controller]);

  const handlePause = useCallback(() => {
    controller.pause();
    handleUpdateIsPlaying(false);
  }, [controller]);

  const handleStepForward = useCallback(() => {
    if (isPlaying) {
      controller.skipForwards();
    } else {
      controller.stepForwards();
    }
  }, [controller, isPlaying]);

  const handleStepBackward = useCallback(() => {
    handlePause();
    controller.stepBackwards();
  }, [controller]);

  const handleFastRewind = useCallback(() => {
    handlePause();
    controller.seekPercent(0);
  }, [controller]);

  const handleFastForward = useCallback(() => {
    controller.seekPercent(100);
  }, [controller]);

  const handleSetSpeed = useCallback(
    (val: number) => {
      controller.setSpeed(val);
    },
    [controller]
  );

  const handleDragTimeline = useCallback(
    (val: number) => {
      controller.seekPercent(val);
    },
    [controller]
  );

  const handleReset = useCallback(() => {
    controller.resetDataStructure();
  }, [controller]);

  const handleGenerate = useCallback(() => {
    controller.generateDataStructure();
  }, [controller]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSpeedMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectSpeed = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndex(index);
    handleSetSpeed(Number(speedOptions[index]));
    setAnchorEl(null);
  };

  return (
    <Box className={styles.root} bgcolor={theme.palette.background.default}>
      <IconButton onClick={() => handleFastRewind()}>
        <FastRewindIcon sx={{ fill: theme.palette.text.primary }} fontSize="large" />
      </IconButton>
      <IconButton onClick={() => handleStepBackward()}>
        <SkipPreviousIcon sx={{ fill: theme.palette.text.primary }} fontSize="large" />
      </IconButton>
      {isTimelineComplete ? (
        <IconButton
          onClick={() => {
            controller.seekPercent(0);
            handlePlay();
          }}
        >
          <ReplayIcon sx={{ fill: theme.palette.text.primary }} fontSize="large" />
        </IconButton>
      ) : isPlaying ? (
        <IconButton
          onClick={() => {
            handlePause();
          }}
        >
          <PauseIcon sx={{ fill: theme.palette.text.primary }} fontSize="large" />
        </IconButton>
      ) : (
        <IconButton
          onClick={() => {
            handlePlay();
          }}
        >
          <PlayIcon sx={{ fill: theme.palette.text.primary }} fontSize="large" />
        </IconButton>
      )}
      <IconButton onClick={() => handleStepForward()}>
        <SkipNextIcon sx={{ fill: theme.palette.text.primary }} fontSize="large" />
      </IconButton>
      <IconButton onClick={() => handleFastForward()}>
        <FastForwardIcon sx={{ fill: theme.palette.text.primary }} fontSize="large" />
      </IconButton>

      <Button onClick={handleClick} className={styles.setSpeedButton}>
        <SpeedIcon
          sx={{ fill: theme.palette.text.primary }}
          className={styles.setSpeedButtonIcon}
          fontSize="large"
        />
        <Typography color="textPrimary" className={styles.currSpeed}>
          {speedOptions[selectedIndex]}
        </Typography>
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
        {speedOptions.map((speedOption, index) => (
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
        ))}
      </Menu>

      <Box className={styles.sliderContainer}>
        <TimeIcon
          className={styles.sliderIcon}
          fontSize="small"
          sx={{ fill: theme.palette.text.primary }}
        />
        <input
          type="range"
          id="timelineSlider"
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
            controller.pause();
          }}
          onMouseUp={() => {
            setUserIsDraggingTimeline(false);
            if (isPlaying) {
              handlePlay();
            }
          }}
        />
      </Box>
      <Button className={styles.resetButton} onClick={handleGenerate}>
        <Typography color="textPrimary" sx={{ whiteSpace: 'nowrap' }}>
          Create New
        </Typography>
      </Button>
      <Button className={styles.resetButton} onClick={handleReset}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Reset All
        </Typography>
      </Button>
    </Box>
  );
};

export default VisualiserControls;
