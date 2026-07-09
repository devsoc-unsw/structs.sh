import { Box, Typography } from '@mui/material';
import React, { useCallback, useContext } from 'react';
import VisualiserContext from './VisualiserContext';
import CreateLink from './CreateLink';
import Saving from './Saving';
import useGlobalState from '../../../store/globalStore';
import { GreenMenuButton } from './styled'

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

  const inDev = useGlobalState((state) => state.inDev);
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
      <GreenMenuButton onClick={handleGenerate}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Create New
        </Typography>
      </GreenMenuButton>
      <GreenMenuButton onClick={handleReset}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Reset All
        </Typography>
      </GreenMenuButton>
      {/* TODO: Release this feature */}
      {inDev && (
        <>
          <Saving />
          <CreateLink />
        </>
      )}
    </Box>
  );
};

export default CreateMenu;
