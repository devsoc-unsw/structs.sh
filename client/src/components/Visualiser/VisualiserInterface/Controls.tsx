import { MouseEvent, useCallback, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import TimeIcon from '@mui/icons-material/AccessTime';
import PauseIcon from '@mui/icons-material/PauseCircleOutline';
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckIcon from '@mui/icons-material/Check';
import { defaultSpeed } from '@/visualiser-src/common/constants';
import VisualiserContext from './VisualiserContext';
import { SPEED_OPTIONS } from '@/constants/ui';

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

const StyledCheckIcon = styled(CheckIcon)(({ theme }) => ({
  fill: theme.palette.text.primary,
}));

const SpeedMenuButton = styled(Button)({
  width: 50,
  marginRight: 10,
});

interface VisualiserControlsProps {
  isTimelineComplete: boolean;
  handleTimelineUpdate: (val: number) => void;
  isPlaying: boolean;
  handleUpdateIsPlaying: (val: boolean) => void;
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
const VisualiserControls = ({
  isTimelineComplete,
  handleTimelineUpdate,
  isPlaying,
  handleUpdateIsPlaying,
}: VisualiserControlsProps) => {
  const { controller } = useContext(VisualiserContext);
  const theme = useTheme();

  const [userIsDraggingTimeline, setUserIsDraggingTimeline] = useState<boolean>(false);

  const [speedMenuAnchorEl, setSpeedMenuAnchorEl] = useState<null | HTMLElement>(null);
  const speedMenuOpen = Boolean(speedMenuAnchorEl);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    SPEED_OPTIONS.indexOf(defaultSpeed * 2)
  );

  const handlePlay = useCallback(() => {
    controller.play();
    handleUpdateIsPlaying(true);
  }, [controller, handleUpdateIsPlaying]);

  const handlePause = useCallback(() => {
    controller.pause();
    handleUpdateIsPlaying(false);
  }, [controller, handleUpdateIsPlaying]);

  const handleReplay = useCallback(() => {
    controller.seekPercent(0);
    handlePlay();
  }, [controller, handlePlay]);

  const handleStepForward = useCallback(() => {
    controller.stepForwards();
    // Stepforward pauses when animation is complete, so set state of isPlaying to false
    handleUpdateIsPlaying(false);
  }, [controller, handleUpdateIsPlaying]);

  const handleStepBackward = useCallback(() => {
    handlePause();
    controller.stepBackwards();
  }, [controller, handlePause]);

  const handleFastRewind = useCallback(() => {
    handlePause();
    controller.seekPercent(0);
  }, [controller, handlePause]);

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

  const handleClickSpeedMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setSpeedMenuAnchorEl(event.currentTarget);
  };

  const handleCloseSpeedMenu = () => {
    setSpeedMenuAnchorEl(null);
  };

  const handleSelectSpeed = (_event: MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndex(index);
    handleSetSpeed(SPEED_OPTIONS[index] / 2);
    setSpeedMenuAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      bottom="0"
      width="100vw"
      bgcolor={theme.palette.background.default}
    >
      <IconButton onClick={handleFastRewind} color="inherit">
        <FastRewindIcon fontSize="large" />
      </IconButton>
      <IconButton onClick={handleStepBackward} color="inherit">
        <SkipPreviousIcon fontSize="large" />
      </IconButton>
      {isTimelineComplete ? (
        <IconButton color="inherit" onClick={handleReplay}>
          <ReplayIcon fontSize="large" />
        </IconButton>
      ) : isPlaying ? (
        <IconButton color="inherit" onClick={handlePause}>
          <PauseIcon fontSize="large" />
        </IconButton>
      ) : (
        <IconButton onClick={handlePlay} color="inherit">
          <PlayIcon fontSize="large" />
        </IconButton>
      )}
      <IconButton onClick={handleStepForward} color="inherit">
        <SkipNextIcon fontSize="large" />
      </IconButton>
      <IconButton onClick={handleFastForward} color="inherit">
        <FastForwardIcon fontSize="large" />
      </IconButton>
      <Box width="100%" paddingRight={2} display="flex" justifyContent="center" alignItems="center">
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
      <SpeedIcon fontSize="large" />
      <SpeedMenuButton
        onClick={handleClickSpeedMenu}
        color="inherit"
        endIcon={<KeyboardArrowUpIcon />}
      >
        <Typography>{SPEED_OPTIONS[selectedIndex]}</Typography>
      </SpeedMenuButton>
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
        {SPEED_OPTIONS.map((speedOption, index) => (
          <MenuItem onClick={(event) => handleSelectSpeed(event, index)} key={index}>
            {index === selectedIndex ? (
              <>
                <ListItemIcon>
                  <StyledCheckIcon />
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
