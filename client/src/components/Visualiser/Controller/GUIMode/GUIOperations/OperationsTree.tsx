import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Alert, Box, List, ListItem, ListItemIcon, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import { keys } from '@mui/system';
import React, { FC, useState } from 'react';
import { Documentation } from 'visualiser-src/common/typedefs';
import { LastLink, Link } from './Links';
import OperationDetails, { OperationsMenuState } from './OperationDetails';

interface Props {
  documentation: Documentation;
  executeCommand: (command: string, args: string[]) => string;
  topicTitle: string;
}

const OperationsTree: FC<Props> = ({ documentation, topicTitle, executeCommand }) => {
  // Tracks which operation items in the menu are expanded
  const [showOp, setShowOp] = useState<OperationsMenuState>({});

  const theme: Theme = useTheme();
  const textPrimaryColour = theme.palette.text.primary;

  const handleClick = (command) => {
    setShowOp({ ...showOp, [command]: !showOp[command] });
  };

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
          const isLast = idx === Object.keys(documentation).length - 1;
          return (
            <Box key={idx}>
              <ListItem
                button
                sx={{
                  paddingTop: '0px',
                  paddingBottom: '0px',
                  paddingLeft: '35px',
                }}
                onClick={() => handleClick(command)}
              >
                <ListItemIcon>
                  {isLast ? (
                    <LastLink colour={textPrimaryColour} />
                  ) : (
                    <Link colour={textPrimaryColour} />
                  )}
                </ListItemIcon>
                <Typography color="textPrimary">{command}</Typography>
                {showOp[command] ? (
                  <ExpandLess sx={{ fill: theme.palette.text.primary }} />
                ) : (
                  <ExpandMore sx={{ fill: theme.palette.text.primary }} />
                )}
              </ListItem>
              <OperationDetails
                command={command}
                op={documentation[command]}
                isLast={isLast}
                showOp={showOp}
                executeCommand={executeCommand}
              />
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export default OperationsTree;
