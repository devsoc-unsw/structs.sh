import {
  Box,
  Typography,
  useTheme,
  Button,
} from '@mui/material';
import React, { useCallback, useContext } from 'react';
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
const VisualiserCreateNewReset = () => {
  const { controller } = useContext(VisualiserContext);
  const theme = useTheme();

  const handleReset = useCallback(() => {
    controller.resetDataStructure();
  }, [controller]);

  const handleGenerate = useCallback(() => {
    controller.generateDataStructure();
  }, [controller]);

  return (
    <Box className={styles.root} bgcolor={theme.palette.background.default} position='absolute' top='80px' right='10px' width='300px'>
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

export default VisualiserCreateNewReset;
