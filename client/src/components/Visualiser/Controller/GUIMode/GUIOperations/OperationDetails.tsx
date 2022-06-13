import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Collapse, List, ListItem, ListItemIcon, Theme, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { makeStyles, useTheme } from '@mui/styles';
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
    <>
      <ListItem
        button
        sx={{
          paddingTop: '0px',
          paddingBottom: '0px',
          paddingLeft: '35px',
        }}
        onClick={handleToggleDisplay}
      >
        <ListItemIcon>
          {isLast ? <LastLink colour={textPrimaryColour} /> : <Link colour={textPrimaryColour} />}
        </ListItemIcon>
        <Typography color="textPrimary">{command}</Typography>
        {shouldDisplay ? (
          <ExpandLess sx={{ fill: textPrimaryColour }} />
        ) : (
          <ExpandMore sx={{ fill: textPrimaryColour }} />
        )}
      </ListItem>
      <Collapse in={shouldDisplay} timeout="auto" unmountOnExit className={classes.opListContainer}>
        {!isLast && (
          <svg width="10" height="166" className={classes.longLink}>
            <line
              x1="5"
              y1="1"
              x2="5"
              y2="166"
              stroke={textPrimaryColour}
              strokeDasharray="50 4"
              strokeWidth="2"
            />
          </svg>
        )}
        <List className={isLast ? `${classes.opList} ${classes.last}` : classes.opList}>
          {documentation[command].args.map((eachArg, idx) => (
            <ListItem key={idx}>
              <ListItemIcon>
                <Link colour={textPrimaryColour} />
              </ListItemIcon>
              <TextField
                label={eachArg}
                value={currentInputs[idx]}
                variant="outlined"
                onChange={(e) => handleSetArguments(e, idx)}
                sx={{ background: theme.palette.background.paper, height: '100%' }}
              />
            </ListItem>
          ))}
          <ListItem>
            <ListItemIcon>
              <LastLink colour={textPrimaryColour} />
            </ListItemIcon>
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
    </>
  );
};

export default OperationDetails;
