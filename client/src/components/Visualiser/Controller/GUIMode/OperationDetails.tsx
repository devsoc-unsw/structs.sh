import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Collapse, List, ListItem, ListItemIcon, Theme, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { makeStyles, useTheme } from '@mui/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisualiserContext from 'components/Visualiser/VisualiserContext';
import React, { FC, useContext, useState } from 'react';
import { LastLink, Link } from './Links';

const useStyles = makeStyles({
  opListContainer: {
    display: 'flex',
    '& div': {
      display: 'flex',
    },
  },
  longLink: {
    marginLeft: '31px',
    flex: '1',
  },
  opList: {
    flex: '8',
    paddingLeft: '40px',
    '& > li': {
      paddingTop: '0px',
      paddingBottom: '0px',
    },
    '& input': {
      height: '7px',
    },
  },
  last: {
    paddingLeft: '110px',
  },
  outline: {
    borderColor: 'black',
  },
  opBtn: {
    height: '30px',
    width: '60px',
  },
  btnText: {
    fontSize: '16px',
    color: '#fff',
  },
});

interface OperationDetailsProps {
  command: string;
  isLast: boolean;
}

const OperationDetails: FC<OperationDetailsProps> = ({ command, isLast }) => {
  const {
    documentation,
    controller,
    timeline: { handleTimelineUpdate },
  } = useContext(VisualiserContext);
  const classes = useStyles();
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

  const executeCommand = (args: string[]): string =>
    controller.doOperation(command, handleTimelineUpdate, ...args);

  return (
    <ListItem sx={{ padding: '0px' }}>
      <ListItem
        button
        sx={{
          paddingTop: '0px',
          paddingBottom: '0px',
          paddingLeft: '35px',
          width: 'auto',
        }}
        onClick={handleToggleDisplay}
      >
        <ListItemIcon>
          {isLast ? <LastLink colour={textPrimaryColour} /> : <Link colour={textPrimaryColour} />}
        </ListItemIcon>
        <Typography color="textPrimary">{command}</Typography>
        {shouldDisplay ? (
          <ChevronRightIcon sx={{ fill: textPrimaryColour }} />
        ) : (
          <ExpandMore sx={{ fill: textPrimaryColour }} />
        )}
      </ListItem>
      <Collapse in={shouldDisplay} timeout="auto" unmountOnExit className={classes.opListContainer}>
        <List
          className={isLast ? `${classes.opList} ${classes.last}` : classes.opList}
          style={{ display: 'flex', padding: '0px' }}
        >
          {documentation[command].args.map((eachArg, idx) => (
            <ListItem
              key={idx}
              style={{
                paddingLeft: '0px',
                paddingRight: '10px',
                width: '140px',
                minWidth: '100px',
              }}
            >
              <TextField
                label={eachArg}
                value={currentInputs[idx]}
                variant="outlined"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setErrorMessage(executeCommand(currentInputs));
                    clearArguments();
                  }
                }}
                onChange={(e) => handleSetArguments(e, idx)}
                sx={{ background: theme.palette.background.paper, height: '100%' }}
              />
            </ListItem>
          ))}
          <ListItem style={{ paddingLeft: '5px' }}>
            <Button
              className={classes.opBtn}
              variant="contained"
              color="primary"
              onClick={() => {
                setErrorMessage(executeCommand(currentInputs));
                clearArguments();
              }}
            >
              <Box className={classes.btnText}>Run</Box>
            </Button>
            <Typography color="red" style={{ marginLeft: '.5rem' }}>
              {errorMessage}
            </Typography>
          </ListItem>
        </List>
      </Collapse>
    </ListItem>
  );
};

export default OperationDetails;
