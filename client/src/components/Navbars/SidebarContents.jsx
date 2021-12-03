import { Box, IconButton, List, ListItem, ListItemIcon } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import React, { useEffect } from 'react';
import logo from '../../assets/img/linked-list.svg';
import filter from 'assets/img/filter.svg';
import { makeStyles, useTheme } from '@mui/styles';
import Filter from './Filter';
import { getMatchedLessons } from 'content';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    strucFilter: {
        marginLeft: '240px',
        marginTop: '5px',
    },
});

const SidebarContents = ({ setShowSidebar }) => {
    const [topics, setTopics] = React.useState([]);
    const [showFilter, setShowFilter] = React.useState(false);
    const [changeTopic, setChangeTopic] = React.useState('');
    const classes = useStyles();

    const theme = useTheme();

    useEffect(() => {
        getMatchedLessons(/.*/).then(setTopics);
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
        <Box sx={{ background: theme.palette.background.paper, height: '100%' }}>
            <IconButton
                size="small"
                className={classes.strucFilter}
                onClick={(e) => setShowFilter(!showFilter)}
            >
                <img src={filter} alt="filter icon" style={{ height: '32px', width: 'auto' }} />
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
            TODO: Style everything here
            <Box>
                <Link to="/" onClick={() => setShowSidebar(false)}>
                    Home
                </Link>
            </Box>
            <Box>
                <Link to="/about" onClick={() => setShowSidebar(false)}>
                    About Page
                </Link>
            </Box>
            <Box>
                <Link to="/feedback" onClick={() => setShowSidebar(false)}>
                    Feedback & Feature Request
                </Link>
            </Box>
        </Box>
    );
};

SidebarContents.propTypes = {
    setShowSidebar: PropTypes.func,
};

export default SidebarContents;
