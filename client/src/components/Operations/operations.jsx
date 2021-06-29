import React from 'react';
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
        paddingTop: '35px'
    },
});


const Operations = ({ topic }) => {

    const [ops, setOps] = React.useState([])
    const [title, setTitle] = React.useState('')

    // toggle collaps
    var opShowList = {};
    for (const op in ops) {
        opShowList[op]=false
    }
    const [showOp, setShowOp] = React.useState(opShowList)

    React.useEffect(async () => {
        setOps(await getTopicOps(topic))
        const lesson = await getLessonContent(topic)
        setTitle(lesson.title)
    })

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

Operations.propTypes = {
    topic: PropTypes.string,
};

export default Operations