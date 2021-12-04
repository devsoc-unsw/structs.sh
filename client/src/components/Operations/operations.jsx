import React, { useEffect } from 'react';
import { List, ListItem, ListItemIcon } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import OpDetails from './opDetails';
import { Link, LastLink } from './Links';
import { getLessonContent, getTopicOps } from 'utils/content';
import { useTheme } from '@mui/styles';

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

    const theme = useTheme();
    const textPrimaryColour = theme.palette.text.primary;

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
            <Typography className={classes.opType} color="textPrimary">
                {title}
            </Typography>
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
                                <ListItemIcon>
                                    {isLast ? (
                                        <LastLink colour={textPrimaryColour} />
                                    ) : (
                                        <Link colour={textPrimaryColour} />
                                    )}
                                </ListItemIcon>
                                <Typography color="textPrimary">{op.command}</Typography>
                                <Typography color="textPrimary">
                                    {showOp[op.command] ? <ExpandLess /> : <ExpandMore />}
                                </Typography>
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
