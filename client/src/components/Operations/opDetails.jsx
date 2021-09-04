import { Collapse, List, ListItem, ListItemIcon } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { lastLink, link } from './utils';

// in case to change the lable color in the future
// const labelStyle = {
//     style: { color: 'black' },
// };

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

const OpDetails = ({ op, isLast, showOp, executeCommand }) => {
    const classes = useStyles();
    const [args, setArguments] = useState([]);

    const handleSetArguments = (e, index) => {
        const newArgs = [...args];
        newArgs[index] = e.target.value;
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
                        stroke="black"
                        stroke-dasharray="50 4"
                        strokeWidth="2"
                    />
                </svg>
            )}
            <List className={isLast ? `${classes.opList} ${classes.last}` : classes.opList}>
                {op.args.map((eachArg, i) => (
                    <ListItem key={i}>
                        <ListItemIcon>{link}</ListItemIcon>
                        <TextField
                            label={eachArg}
                            //InputLabelProps={labelStyle}
                            //InputProps={{ classes: { notchedOutline: classes.outline } }}
                            variant="outlined"
                            onChange={(e) => handleSetArguments(e, i)}
                        />
                    </ListItem>
                ))}
                <ListItem>
                    <ListItemIcon>{lastLink}</ListItemIcon>
                    <Button className={classes.opBtn} variant="contained" color="primary">
                        <div
                            className={classes.btnText}
                            onClick={() => executeCommand(op.command, ...args)}
                        >
                            Go
                        </div>
                    </Button>
                </ListItem>
            </List>
        </Collapse>
    );
};

OpDetails.propTypes = {
    op: PropTypes.object,
    isLast: PropTypes.bool,
    showOp: PropTypes.object,
};

export default OpDetails;
