import React, { useContext, useState, useEffect } from 'react';
import { Alert, Box, List, Typography, useTheme, Collapse } from '@mui/material';
import FloatingWindow from 'components/FloatingWindow';
import VisualiserContext from './VisualiserContext';
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
const Operations = () => {
  const {
    controller,
    documentation,
    topicTitle,
    timeline: { handleTimelineUpdate, handleUpdateIsPlaying },
  } = useContext(VisualiserContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    // const executeCommand = () => {
    //   const command = 'append';
    //   const args = ['5'];
    //   controller.doOperation(command, handleTimelineUpdate, ...args);
    // };
    if (!controller) return;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'z') {
        // e.preventDefault();
        const command = 'append';
        const args = ['5'];
        controller.doOperation(command, handleTimelineUpdate, ...args);
        handleUpdateIsPlaying(true);
        // executeCommand();
      }
    });
  }, [controller]);

  // return !documentation ? (
  //   <Alert severity="error">
  //     No operations are defined for the topicTitle &apos;
  //     {topicTitle}
  //     &apos;
  //   </Alert>
  // ) : (
  //   <FloatingWindow
  //     flexDirection="row"
  //     isExpanded={isExpanded}
  //     handleToggleExpansion={handleToggleExpansion}
  //   >
  //     <List>
  //       {Object.keys(documentation).map((command) => (
  //         <OperationDetails command={command} key={documentation[command].id} />
  //       ))}
  //     </List>
  //   </FloatingWindow>
  // );
  return <></>;
};

export default Operations;
