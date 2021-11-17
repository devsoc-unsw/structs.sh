import { IconButton, List, ListItem, ListItemIcon } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import React from 'react';
import logo from '../../assets/img/linked-list.svg';
import filter from 'assets/img/filter.svg';
import { makeStyles } from '@material-ui/core/styles';
import Filter from './filter';
import { getMatchedLessons } from 'content';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    strucFilter: {
        marginLeft: '240px',
        marginTop: '5px',
    },
});

const Sidebar = ({ setShowSidebar }) => {
    const [topics, setTopics] = React.useState([]);
    const [showFilter, setShowFilter] = React.useState(false);
    const [changeTopic, setChangeTopic] = React.useState('');
    const classes = useStyles();

    React.useEffect(async () => {
        setTopics(await getMatchedLessons(/.*/));
    }, []);

    if (changeTopic) {
        //TODO move warning
        setShowSidebar(false);
        return <Redirect to={`/visualiser/${changeTopic}/`} />;
    }

    const handleClick = (e) => {
        const title = e.target.innerText;
        for (const topic of topics) {
            if (topic.title === title) {
                setChangeTopic(topic.topic);
            }
        }
    };

    return (
        <div className="structure-list">
            <IconButton className={classes.strucFilter} onClick={(e) => setShowFilter(!showFilter)}>
                <img src={filter} alt="filter icon" />
            </IconButton>
            <Collapse in={showFilter} timeout="auto" unmountOnExit>
                <Filter setTopics={setTopics} />
            </Collapse>
            <List>
                {topics.map((struct, idx) => {
                    return (
                        <ListItem key={idx} button onClick={handleClick} className="struct-item">
                            <ListItemIcon>
                                <img className="struct-logo" src={logo} alt="struct logo" />
                            </ListItemIcon>
                            <div>{struct.title}</div>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
};

Sidebar.propTypes = {
    setShowSidebar: PropTypes.func,
};

export default Sidebar;
