import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useContext } from 'react';
import VisualiserContext from './VisualiserContext';
import CreateLink from './CreateLink';
import Saving from './Saving';

const MenuButton = styled(Button)({
  backgroundColor: '#46B693',
  '&:hover': {
    backgroundColor: '#2b6e5a',
  },
});

const LoadingButton = styled(Button)({
  backgroundColor: '#C81437',
  '&:hover': {
    backgroundColor: '#F05C79',
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
  const { controller, topicTitle } = useContext(VisualiserContext);

  const handleReset = useCallback(() => {
    controller.resetDataStructure();
  }, [controller]);

  const handleGenerate = useCallback(() => {
    controller.generateDataStructure();
  }, [controller]);

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
      <Saving topicTitle={topicTitle} controller={controller} />
      <CreateLink />
    </Box>
  );
};

export default CreateMenu;
