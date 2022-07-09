import React, { useContext } from 'react';
import { Alert, Box, List, Typography, useTheme, Collapse } from '@mui/material';
import VisualiserContext from 'components/Visualiser/VisualiserContext';
import FloatingWindow from 'components/FloatingWindow/FloatingWindow';
import OperationDetails from './OperationDetails';

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
const GUIMode = () => {
  const { documentation, topicTitle } = useContext(VisualiserContext);

  return !documentation ? (
    <Alert severity="error">
      No operations are defined for the topicTitle &apos;
      {topicTitle}
      &apos;
    </Alert>
  ) : (
    <FloatingWindow flexDirection="row">
      <List>
        {Object.keys(documentation).map((command) => (
          <OperationDetails command={command} key={documentation[command].id} />
        ))}
      </List>
    </FloatingWindow>
  );
};

export default GUIMode;
