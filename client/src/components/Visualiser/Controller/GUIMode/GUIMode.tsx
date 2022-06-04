import { Box } from '@mui/material';
import React, { FC } from 'react';
import { Documentation } from 'visualiser-src/common/typedefs';
import OperationsTree from './GUIOperations/OperationsTree';

interface Props {
  documentation: Documentation;
  executeCommand: (command: string, args: string[]) => string;
  topicTitle: string;
}

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
const GUIMode: FC<Props> = ({ documentation, executeCommand, topicTitle }) => (
  <Box sx={{ height: 'calc(100% - 64px)', overflow: 'auto' }}>
    <OperationsTree
      documentation={documentation}
      topicTitle={topicTitle}
      executeCommand={executeCommand}
    />
  </Box>
);

export default GUIMode;
