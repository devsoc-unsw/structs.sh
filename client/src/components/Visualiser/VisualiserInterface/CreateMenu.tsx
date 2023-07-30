import { Box, Typography, useTheme, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import { useCallback, useContext } from 'react';
import VisualiserContext from './VisualiserContext';
import { recorder } from './VisualiserInterface';

const MenuButton = styled(Button)({
  backgroundColor: '#46B693',
  '&:hover': {
    backgroundColor: '#2b6e5a',
  },
});

const blink = keyframes`
  0% { opacity: 0.1; }
  50% { opacity: 1; }
  100% { opacity: 0.1; }
`;

const BlinkingCircle = styled('div')({
  backgroundColor: 'red',
  borderRadius: 10,
  width: 8,
  height: 8,
  animation: `${blink} 1.5s linear infinite`,
  position: 'absolute',
  bottom: 12,
  right: 183
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

  const handleRecord = () => {
    recorder.toggleRecord();
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
      <MenuButton onClick={handleRecord}>
        <Typography color="textPrimary" whiteSpace="nowrap">
         Toggle Recording
        </Typography>
        <Box>{(recorder.isRecording() ? <BlinkingCircle/> : null)}</Box>
      </MenuButton>
    </Box>
  );
};

export default CreateMenu;
