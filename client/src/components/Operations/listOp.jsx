import React from 'react';
import { List, ListItem, ListItemIcon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import OpDetails from './opDetails';
import { link, lastLink } from './utils';

const useStyles = makeStyles({
    opItem: {
        paddingTop: '0px',
        paddingBottom: '0px',
        paddingLeft: '35px',
    },
    opType: {
        fontSize: '20px',
        paddingLeft: '15px',
        paddingTop: '35px'
    },
});

const ops = ['Insert', 'Delete'];

const ListOp = ({structType}) => {
    const [showOp, setShowInsert] = React.useState({ Insert: false, Delete: false });

    const handleClick = (op) => {
        setShowInsert({ ...showOp, [op]: !showOp[op] });
    };

    const classes = useStyles();
    return (
        <div className="operation-list">
            <Typography className={classes.opType}>{structType}</Typography>
            <List>
                {ops.map((op, idx) => {
                    const isLast = idx === ops.length - 1;
                    return (
                        <div key={idx}>
                            <ListItem
                                button
                                className={classes.opItem}
                                onClick={() => handleClick(op)}
                            >
                                <ListItemIcon>{isLast ? lastLink : link}</ListItemIcon>
                                <span>{op}</span>
                                {showOp[op] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            {<OpDetails op={op} isLast={isLast} showOp={showOp}/>}
                        </div>
                    );
                })}
            </List>
        </div>
    );
};

ListOp.propTypes = {
    structType: PropTypes.string
};

export default ListOp