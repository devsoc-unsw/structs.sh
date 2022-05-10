import {
  Box, Collapse, List, ListItem, ListItemIcon, Theme,
} from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { makeStyles, useTheme } from '@mui/styles';
import { Operation } from 'components/Visualiser/commandsInputRules';
import React, { FC, useState } from 'react';
import { LastLink, Link } from './Links';

export interface OperationsMenuState {
  [k: string]: boolean;
}

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

interface Props {
  op: Operation;
  isLast: boolean;
  showOp: OperationsMenuState;
  executeCommand: (command: string, args: string[]) => string;
}

const OperationDetails: FC<Props> = ({
  op, isLast, showOp, executeCommand,
}) => {
  const classes = useStyles();
  const [args, setArguments] = useState<string[]>(
    Array((op && op.args && op.args.length) || 0).fill(''),
  );

  const theme: Theme = useTheme();
  const textPrimaryColour = theme.palette.text.primary;

  const handleSetArguments = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const newArgs = [...args];
    newArgs[index] = String(e.target.value);
    setArguments(newArgs);
  };

  const clearArguments = () => {
    const newArgs = [...args];
    newArgs.fill('');
    setArguments(newArgs);
  };

  return (
    <Collapse
      in={showOp[op.command]}
      timeout="auto"
      unmountOnExit
      className={classes.opListContainer}
    >
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
        {op.args.map((eachArg, idx) => (
          <ListItem key={idx}>
            <ListItemIcon>
              <Link colour={textPrimaryColour} />
            </ListItemIcon>
            <TextField
              label={eachArg}
              value={args[idx]}
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
              executeCommand(op.command, [...args]);
              clearArguments();
            }}
          >
            <Box className={classes.btnText}>Run</Box>
          </Button>
        </ListItem>
      </List>
    </Collapse>
  );
};

export default OperationDetails;
