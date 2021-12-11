import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Theme,
    Typography,
} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import React, { useEffect, useState } from 'react';
import logo from '../../assets/img/linked-list.svg';
import filter from 'assets/img/filter.svg';
import { makeStyles, useTheme } from '@mui/styles';
import Filter from './Filter';
import { getMatchedLessons } from 'utils/content';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Sidebar.module.scss';
import structsLogo from 'assets/img/logo.png';
import HomeIcon from '@mui/icons-material/Cottage';
import AboutIcon from '@mui/icons-material/Info';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { HorizontalRule } from 'components/HorizontalRule';
import { getTopics, Topic } from 'utils/apiRequests';
import { Notification } from 'utils/Notification';
import TopicIcon from '@mui/icons-material/School';
import FilterIcon from '@mui/icons-material/FilterList';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { LineLoader } from 'components/Loader';
import { TagList } from 'components/Tags/TagList';
import { titleToUrl } from 'utils/url';
import EditIcon from '@mui/icons-material/Edit';

const SidebarContents = ({ setShowSidebar }) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [showFilter, setShowFilter] = useState(false);

    const theme: Theme = useTheme();

    useEffect(() => {
        getTopics().then(setTopics).catch(Notification.error);
    }, []);

    return (
        <Box
            className={styles.sidebar}
            sx={{ background: theme.palette.background.paper, height: '100%' }}
        >
            <Box sx={{ textAlign: 'center' }}>
                <IconButton disabled>
                    <img src={structsLogo} className={styles.logo} />
                    <Typography
                        display="inline"
                        color="textPrimary"
                        variant="h6"
                        sx={{ fontFamily: 'Ubuntu Mono', pl: 1, pr: 2 }}
                    >
                        Structs.sh
                    </Typography>
                </IconButton>
            </Box>
            <HorizontalRule />
            <List>
                <RouterLink to="/" onClick={() => setShowSidebar(false)} className={styles.link}>
                    <ListItemButton>
                        <ListItemIcon>
                            <HomeIcon sx={{ fill: theme.palette.text.primary }} />
                        </ListItemIcon>
                        <ListItemText>Home</ListItemText>
                    </ListItemButton>
                </RouterLink>
                <RouterLink
                    to="/about"
                    onClick={() => setShowSidebar(false)}
                    className={styles.link}
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <AboutIcon sx={{ fill: theme.palette.text.primary }} />
                        </ListItemIcon>
                        <ListItemText>About Structs.sh</ListItemText>
                    </ListItemButton>
                </RouterLink>
                <RouterLink
                    to="/feedback"
                    onClick={() => setShowSidebar(false)}
                    className={styles.link}
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <FeedbackIcon sx={{ fill: theme.palette.text.primary }} />
                        </ListItemIcon>
                        <ListItemText>Feedback & Feature Request</ListItemText>
                    </ListItemButton>
                </RouterLink>
            </List>

            {/* Topics */}
            <HorizontalRule />
            <Typography variant="h6" color="textSecondary" sx={{ ml: 2 }}>
                Topics
            </Typography>
            <List>
                {topics && topics.length > 0 ? (
                    topics.map((topic, idx) => {
                        return (
                            <RouterLink
                                to={`/visualiser/${titleToUrl(topic.title)}`}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                            >
                                <ListItem key={idx} button>
                                    <ListItemAvatar>
                                        <TopicIcon />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={topic.title}
                                        secondary={<TagList tags={topic.courses}></TagList>}
                                    />
                                </ListItem>
                            </RouterLink>
                        );
                    })
                ) : (
                    <LineLoader />
                )}
                <ListItem onClick={(e) => setShowFilter(!showFilter)} button>
                    <ListItemAvatar>
                        <FilterIcon />
                    </ListItemAvatar>
                    <ListItemText>Filter Topics</ListItemText>
                    {showFilter ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
            </List>
            <Collapse in={showFilter} timeout="auto" unmountOnExit>
                <Filter
                    setFilter={() => {
                        alert('Unimplemented');
                    }}
                />
            </Collapse>

            {/* Content Management */}
            <HorizontalRule />
            <Typography variant="h6" color="textSecondary" sx={{ ml: 2 }}>
                Content Management
            </Typography>
            <List>
                <RouterLink
                    to="/content"
                    onClick={() => setShowSidebar(false)}
                    className={styles.link}
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <EditIcon sx={{ fill: theme.palette.text.primary }} />
                        </ListItemIcon>
                        <ListItemText>CMS Dashboard</ListItemText>
                    </ListItemButton>
                </RouterLink>
            </List>
        </Box>
    );
};

SidebarContents.propTypes = {
    setShowSidebar: PropTypes.func,
};

export default SidebarContents;
