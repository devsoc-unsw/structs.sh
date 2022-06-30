import React, { FC, useContext, useState } from 'react';
// import OperationsTree from './GUIOperations/OperationsTree';
import { Alert, Box, List, Typography, useTheme, Collapse } from '@mui/material';
import VisualiserContext from 'components/Visualiser/VisualiserContext';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
      sx={{
        overflow: 'auto',
        background: theme.palette.background.default,
        position: 'absolute',
        bottom: '7vh',
        // padding: 2,
        height: '45vh',
        display: 'flex',
        alignItems: 'stretch',
        // justifyContent: 'center',
      }}
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
          <ExpandMore sx={{ fill: textPrimaryColour }} />
        )}
      </Box>
      <Collapse in={shouldDisplay} unmountOnExit timeout="auto" orientation="horizontal">
        <Box sx={{ padding: 2 }}>
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
      </Collapse>
    </Box>
    // <Collapse>
    // <Box
    //   sx={{
    //     overflow: 'auto',
    //     background: theme.palette.background.default,
    //     position: 'absolute',
    //     bottom: '7vh',
    //     padding: 2,
    //     minWidth: '30vw',
    //     minHeight: '40vh',
    //   }}
    // >
    //   <Typography color="textPrimary">{topicTitle}</Typography>
    //   <List>
    //     {Object.keys(documentation).map((command, idx) => (
    //       <Box key={documentation[command].id}>
    //         <OperationDetails
    //           command={command}
    //           isLast={idx === Object.keys(documentation).length - 1}
    //         />
    //       </Box>
    //     ))}
    //   </List>
    // </Box>
    // </Collapse>
  );
};

export default GUIMode;
