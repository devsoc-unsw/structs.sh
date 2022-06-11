import { Box } from '@mui/material';
import React, { FC } from 'react';
import { DataStructure, Documentation } from 'visualiser-src/common/typedefs';
import OperationsTree from './GUIOperations/OperationsTree';
/**
 * The GUI form that lets users input arguments to a menu of commands and then
 * have them affect the visualiser.
 *
 * It receives an `executeCommand` callback which should be linked to call
 * commands in the visualiser source code.
 *
 * All the commands that the form supports are listed separately in the
 * `commandsInputRules.ts` file, where the terminal commands also reside.
 */
const GUIMode = () => (
  <Box sx={{ height: 'calc(100% - 64px)', overflow: 'auto' }}>
    <OperationsTree />
  </Box>
);

export default GUIMode;
