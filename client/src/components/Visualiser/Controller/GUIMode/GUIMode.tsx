import React, { FC, useContext } from 'react';
// import OperationsTree from './GUIOperations/OperationsTree';
import { Alert, Box, List, Typography, useTheme } from '@mui/material';
import VisualiserContext from 'components/Visualiser/VisualiserContext';
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
  const theme = useTheme();

  return !documentation ? (
    <Alert severity="error">
      No operations are defined for the topicTitle &apos;
      {topicTitle}
      &apos;
    </Alert>
  ) : (
    <Box
      sx={{
        overflow: 'auto',
        background: theme.palette.background.default,
        position: 'absolute',
        bottom: '10vh',
        padding: 2,
        width: '30vw',
        height: '40vh',
      }}
    >
      <Typography color="textPrimary">{topicTitle}</Typography>
      <List>
        {Object.keys(documentation).map((command, idx) => (
          <Box key={documentation[command].id}>
            <OperationDetails
              command={command}
              isLast={idx === Object.keys(documentation).length - 1}
            />
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default GUIMode;
