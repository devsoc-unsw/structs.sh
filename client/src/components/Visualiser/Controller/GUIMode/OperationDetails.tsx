import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Collapse, List, ListItem, ListItemIcon, Theme, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { makeStyles, useTheme } from '@mui/styles';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import VisualiserContext from 'components/Visualiser/VisualiserContext';
import React, { FC, useContext, useState } from 'react';

interface OperationDetailsProps {
  command: string;
}

const OperationDetails: FC<OperationDetailsProps> = ({ command }) => {
  const {
    documentation,
    controller,
    timeline: { handleTimelineUpdate, handleUpdateIsPlaying },
    codeSnippet: { handleSetCodeSnippetExpansion },
  } = useContext(VisualiserContext);
  // const classes = useStyles();
  const [shouldDisplay, setShouldDisplay] = useState<boolean>(false);
  const [currentInputs, setCurrentInputs] = useState<string[]>(
    Array(documentation[command]?.args?.length || 0).fill('')
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const theme: Theme = useTheme();
  const textPrimaryColour = theme.palette.text.primary;

  const handleToggleDisplay = () => {
    setShouldDisplay(!shouldDisplay);
  };

  const handleSetArguments = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newArgs = [...currentInputs];
    newArgs[index] = String(e.target.value);
    setCurrentInputs(newArgs);
  };

  const clearArguments = () => {
    const newArgs = [...currentInputs];
    newArgs.fill('');
    setCurrentInputs(newArgs);
  };

  const executeCommand = (args: string[]) => {
    const err = controller.doOperation(command, handleTimelineUpdate, ...args);
    setErrorMessage(err);
    if (err !== '') {
      setTimeout(() => setErrorMessage(''), 2000);
    } else {
      handleSetCodeSnippetExpansion(true);
      handleUpdateIsPlaying(true);
    }
    clearArguments();
  };

  return (
    <ListItem sx={{ height: 50, padding: 0 }}>
      <Box width="180px">
        <Button
          sx={{
            textTransform: 'none',
            display: 'flex',
            justifyContent: 'space-between',
          }}
          onClick={handleToggleDisplay}
          endIcon={
            shouldDisplay ? (
              <ChevronRight sx={{ fill: textPrimaryColour }} />
            ) : (
              <ChevronLeft sx={{ fill: textPrimaryColour }} />
            )
          }
          fullWidth
        >
          <Typography color="textPrimary">{command}</Typography>
        </Button>
      </Box>
      <Collapse in={shouldDisplay} timeout="auto" orientation="horizontal">
        <Box display="flex" alignItems="center">
          {documentation[command].args.map((eachArg, idx) => (
            <Box key={idx} boxSizing="border-box" padding="5px" width="110px">
              <TextField
                size="small"
                value={currentInputs[idx]}
                variant="outlined"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    executeCommand(currentInputs);
                  }
                }}
                onChange={(e) => handleSetArguments(e, idx)}
                placeholder={eachArg}
                sx={{ backgroundColor: theme.palette.background.paper }}
              />
            </Box>
          ))}
          <Box
            boxSizing="border-box"
            display="flex"
            alignItems="center"
            paddingRight="10px"
            paddingLeft="5px"
          >
            <Button
              variant="contained"
              // color="primary"
              onClick={() => {
                executeCommand(currentInputs);
              }}
            >
              Run
            </Button>
            <Typography color="red" marginLeft="10px">
              {errorMessage}
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </ListItem>
  );
};

export default OperationDetails;
