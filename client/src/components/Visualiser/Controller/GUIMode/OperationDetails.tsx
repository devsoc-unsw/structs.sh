import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Collapse, List, ListItem, ListItemIcon, Theme, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { makeStyles, useTheme } from '@mui/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisualiserContext from 'components/Visualiser/VisualiserContext';
import React, { FC, useContext, useState } from 'react';

// const useStyles = makeStyles({
//   opListContainer: {
//     display: 'flex',
//     '& div': {
//       display: 'flex',
//     },
//   },
//   longLink: {
//     marginLeft: '31px',
//     flex: '1',
//   },
//   opList: {
//     flex: '8',
//     paddingLeft: '40px',
//     '& > li': {
//       paddingTop: '0px',
//       paddingBottom: '0px',
//     },
//     '& input': {
//       height: '7px',
//     },
//   },
//   last: {
//     paddingLeft: '110px',
//   },
//   outline: {
//     borderColor: 'black',
//   },
//   opBtn: {
//     height: '30px',
//     width: '60px',
//   },
//   btnText: {
//     fontSize: '16px',
//     color: '#fff',
//   },
// });

interface OperationDetailsProps {
  command: string;
}

const OperationDetails: FC<OperationDetailsProps> = ({ command }) => {
  const {
    documentation,
    controller,
    timeline: { handleTimelineUpdate },
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
      clearArguments();
    }
  };

  return (
    <ListItem sx={{ height: 50, padding: '0px' }}>
      <Box sx={{ width: 180 }}>
        <Button
          sx={{
            textTransform: 'none',
          }}
          onClick={handleToggleDisplay}
          endIcon={
            shouldDisplay ? (
              <ChevronRightIcon sx={{ fill: textPrimaryColour }} />
            ) : (
              <ExpandMore sx={{ fill: textPrimaryColour }} />
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
            <Box
              key={idx}
              style={{
                margin: 5,
                width: 80,
              }}
            >
              <TextField
                size="small"
                label={eachArg}
                value={currentInputs[idx]}
                variant="outlined"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    executeCommand(currentInputs);
                  }
                }}
                onChange={(e) => handleSetArguments(e, idx)}
                sx={{ background: theme.palette.background.paper }}
              />
            </Box>
          ))}
          <Box display="flex" alignItems="center" marginLeft="5px">
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
