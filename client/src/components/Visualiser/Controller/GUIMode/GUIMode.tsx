import React, { FC, useContext, useState } from 'react';
// import OperationsTree from './GUIOperations/OperationsTree';
import { Alert, Box, List, Typography, useTheme, Collapse } from '@mui/material';
import VisualiserContext from 'components/Visualiser/VisualiserContext';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMore from '@mui/icons-material/ExpandMore';
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

  const [shouldDisplay, setShouldDisplay] = useState<boolean>(true);
  const handleToggleDisplay = () => {
    setShouldDisplay(!shouldDisplay);
  };

  const textPrimaryColour = theme.palette.text.primary;

  return !documentation ? (
    <Alert severity="error">
      No operations are defined for the topicTitle &apos;
      {topicTitle}
      &apos;
    </Alert>
  ) : (
    <Box
      bgcolor={theme.palette.background.default}
      position="absolute"
      left="0"
      bottom="7vh"
      maxHeight="40vh"
      display="flex"
      flexDirection="row"
    >
      <Box
        onClick={handleToggleDisplay}
        sx={{
          background: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {shouldDisplay ? (
          <ChevronRightIcon sx={{ fill: textPrimaryColour }} />
        ) : (
          <ChevronLeftIcon sx={{ fill: textPrimaryColour }} />
        )}
      </Box>
      <Collapse in={shouldDisplay} orientation="horizontal">
        <Box
          boxSizing="border-box"
          padding="10px"
          minWidth="30vw"
          maxWidth="50vw"
          height="100%"
          overflow="auto"
        >
          <List>
            {Object.keys(documentation).map((command) => (
              <OperationDetails command={command} key={documentation[command].id} />
            ))}
          </List>
        </Box>
      </Collapse>
    </Box>
  );
};

export default GUIMode;
