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
import { styled } from '@mui/system';
import React, { EventHandler, FC, useCallback, useContext, useEffect, useState } from 'react';
import { defaultSpeed } from 'visualiser-src/common/constants';
import VisualiserContext from '../VisualiserContext';
import styles from './Control.module.scss';

const TimelineSlider = styled('input')({
  appearance: 'none',
  width: '100%',
  alignSelf: 'center',
  background: '#aeabba',
  cursor: 'pointer',
  '&::-webkit-slider-thumb': {
    appearance: 'none',
    height: '12px',
    width: '5px',
    background: '#fafafa',
  },
  '&::-moz-range-thumb': {
    borderRadius: '0',
    border: 'none',
    height: '100%',
    width: '5px',
    background: '#fafafa',
  },
});

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
  const theme = useTheme();

  const [userIsDraggingTimeline, setUserIsDraggingTimeline] = useState<boolean>(false);

  const [speedMenuAnchorEl, setSpeedMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const speedMenuOpen = Boolean(speedMenuAnchorEl);
  const speedOptions: number[] = [0.25, 0.5, 1.0, 1.25, 1.5, 1.75, 2];
  const [selectedIndex, setSelectedIndex] = useState<number>(speedOptions.indexOf(defaultSpeed));

  const handlePlay = useCallback(() => {
    controller.play();
    handleUpdateIsPlaying(true);
  }, [controller]);

  const handlePause = useCallback(() => {
    controller.pause();
    handleUpdateIsPlaying(false);
  }, [controller]);

  const handleStepForward = useCallback(() => {
    controller.stepForwards();
    // Stepforward pauses when animation is complete, so set state of isPlaying to false
    handleUpdateIsPlaying(false);
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

  const handleClickSpeedMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSpeedMenuAnchorEl(event.currentTarget);
  };

  const handleCloseSpeedMenu = () => {
    setSpeedMenuAnchorEl(null);
  };

  const handleSelectSpeed = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndex(index);
    handleSetSpeed(speedOptions[index] / 2);
    setSpeedMenuAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      position="fixed"
      bottom="0"
      width="100vw"
      bgcolor={theme.palette.background.default}
    >
      <IconButton onClick={() => handleFastRewind()} color="inherit">
        <FastRewindIcon fontSize="large" />
      </IconButton>
      <IconButton onClick={() => handleStepBackward()} color="inherit">
        <SkipPreviousIcon fontSize="large" />
      </IconButton>
      {isTimelineComplete ? (
        <IconButton
          color="inherit"
          onClick={() => {
            controller.seekPercent(0);
            handlePlay();
          }}
        >
          <ReplayIcon fontSize="large" />
        </IconButton>
      ) : isPlaying ? (
        <IconButton
          color="inherit"
          onClick={() => {
            handlePause();
          }}
        >
          <PauseIcon fontSize="large" />
        </IconButton>
      ) : (
        <IconButton
          onClick={() => {
            handlePlay();
          }}
          color="inherit"
        >
          <PlayIcon fontSize="large" />
        </IconButton>
      )}
      <IconButton onClick={() => handleStepForward()} color="inherit">
        <SkipNextIcon fontSize="large" />
      </IconButton>
      <IconButton onClick={() => handleFastForward()} color="inherit">
        <FastForwardIcon fontSize="large" />
      </IconButton>
      <Box width="100%" display="flex" justifyContent="center" alignItems="center">
        <TimeIcon fontSize="small" />
        <TimelineSlider
          type="range"
          id="timelineSlider"
          min="0"
          max="100"
          defaultValue="0"
          step="0.01"
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
      <Button onClick={handleClickSpeedMenu} color="inherit">
        <SpeedIcon fontSize="large" />
        <Typography>{speedOptions[selectedIndex]}</Typography>
      </Button>
      <Menu
        open={speedMenuOpen}
        anchorEl={speedMenuAnchorEl}
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
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <CheckIcon />
                </ListItemIcon>
                {speedOption}
              </>
            ) : (
              <ListItemText inset>{speedOption}</ListItemText>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default VisualiserControls;
