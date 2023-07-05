import { Box, Typography, useTheme, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCallback, useContext } from 'react';
import VisualiserContext from './VisualiserContext';
import { toggleCapture } from '../VisualiserCanvas';
import { stopRecording } from '../canvasRecordIndex';
import { changeRecordingStatus, toggleRecording } from './VisualiserInterface';




const MenuButton = styled(Button)({
  backgroundColor: '#46B693',
  '&:hover': {
    backgroundColor: '#2b6e5a',
  },
});

/**
 * Contains the ability to reset and create new data structures
 *
 * It receives a bunch of callbacks and connects it to each of the corresponding
 * UI components.
 *
 * Eg. it receives a `handlePlay` callback and attaches it to the Play button's
 *     `onClick` handler.
 */
const CreateMenu = () => {
  const { controller } = useContext(VisualiserContext);

  const handleReset = useCallback(() => {
    controller.resetDataStructure();
  }, [controller]);

  const handleGenerate = useCallback(() => {
    controller.generateDataStructure();
  }, [controller]);

  let stopGIF : Boolean = true;
  const handleGIFCapture = () => {
    changeRecordingStatus();
  }
    
  return (
    <Box
      display="flex"
      flexDirection="column"
      position="absolute"
      width="200px"
      top="80px"
      right="10px"
      gap="10px"
    >
      <MenuButton onClick={handleGenerate}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Create New
        </Typography>
      </MenuButton>
      <MenuButton onClick={handleReset}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Reset All
        </Typography>
      </MenuButton>
      <MenuButton onClick={handleGIFCapture}>
        <Typography color="textPrimary" whiteSpace="nowrap">
         Toggle Capture GIF
        </Typography>
      </MenuButton>
    </Box>
  );
};

export default CreateMenu;
