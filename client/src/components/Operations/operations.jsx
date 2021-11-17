import React, { useEffect } from 'react';
import { List, ListItem, ListItemIcon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import OpDetails from './opDetails';
import { link, lastLink } from './utils';
import { getLessonContent, getTopicOps } from 'content';

const useStyles = makeStyles({
    opItem: {
        paddingTop: '0px',
        paddingBottom: '0px',
        paddingLeft: '35px',
    },
    opType: {
        fontSize: '20px',
        paddingLeft: '15px',
        paddingTop: '35px',
    },
});

const Operations = ({ topic, executeCommand }) => {
    const [ops, setOps] = React.useState([]);
    const [title, setTitle] = React.useState('');

    // toggle collaps
    var opShowList = {};
    for (const op in ops) {
        opShowList[op.command] = false;
    }
    const [showOp, setShowOp] = React.useState(opShowList);

    useEffect(() => {
        getTopicOps(topic)
            .then(setOps)
            .catch((err) => {
                console.log(err);
            });
        getLessonContent(topic)
            .then((lesson) => {
                setTitle(lesson.title);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [topic, setOps, setTitle]);

    const handleClick = (op) => {
        setShowOp({ ...showOp, [op]: !showOp[op] });
    };

    const classes = useStyles();

    return (
        <div className="operation-list">
            <Typography className={classes.opType}>{title}</Typography>
            <List>
                {ops.map((op, idx) => {
                    const isLast = idx === ops.length - 1;
                    return (
                        <div key={idx}>
                            <ListItem
                                button
                                className={classes.opItem}
                                onClick={() => handleClick(op.command)}
                            >
                                <ListItemIcon>{isLast ? lastLink : link}</ListItemIcon>
                                <span>{op.command}</span>
                                {showOp[op.command] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            {
                                <OpDetails
                                    op={op}
                                    isLast={isLast}
                                    showOp={showOp}
                                    executeCommand={executeCommand}
                                />
                            }
                        </div>
                    );
                })}
            </List>
        </div>
    );
};

Operations.propTypes = {
    topic: PropTypes.string,
};

export default Operations;
