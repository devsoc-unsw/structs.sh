import PropTypes from 'prop-types';
import { Collapse } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon } from '@material-ui/core';
import {link, lastLink} from './utils'

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

const OpDetails = ({ op, isLast, showOp }) => {
    const classes = useStyles();

    return (
        <Collapse in={showOp[op]} timeout="auto" unmountOnExit className={classes.opListContainer}>
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
                <ListItem>
                    <ListItemIcon>{link}</ListItemIcon>
                    <TextField
                        label="index"
                        //InputLabelProps={labelStyle}
                        //InputProps={{ classes: { notchedOutline: classes.outline } }}
                        variant="outlined"
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>{link}</ListItemIcon>
                    <TextField
                        label="value"
                        // InputLabelProps={labelStyle}
                        //InputProps={{ classes: { notchedOutline: classes.outline } }}
                        variant="outlined"
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>{lastLink}</ListItemIcon>
                    <Button className={classes.opBtn} variant="contained" color="primary">
                        <div className={classes.btnText}>Go</div>
                    </Button>
                </ListItem>
            </List>
        </Collapse>
    );
};

OpDetails.propTypes = {
    op: PropTypes.string,
    isLast: PropTypes.bool,
    showOp: PropTypes.func
}

export default OpDetails