import { Alert, Box, List, Typography } from '@mui/material';
import VisualiserContext from 'components/Visualiser/VisualiserContext';
import React, { useContext } from 'react';
import OperationDetails from './OperationDetails';

const OperationsTree = () => {
  const { documentation, topicTitle } = useContext(VisualiserContext);
  return !documentation ? (
    <Alert severity="error">
      No operations are defined for the topicTitle &apos;
      {topicTitle}
      &apos;
    </Alert>
  ) : (
    <Box sx={{ padding: 2 }}>
      <Typography color="textPrimary">{topicTitle}</Typography>
      <List>
        {Object.keys(documentation).map((command, idx) => {
          return (
            <Box key={documentation[command].id}>
              <OperationDetails
                command={command}
                isLast={idx === Object.keys(documentation).length - 1}
              />
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export default OperationsTree;
