import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  AppBar,
  Box,
  Grid,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  ListItemText,
  Button,
  FormControl,
  ListItemIcon,
  TextField,
  useTheme,
} from '@mui/material';
import Check from '@mui/icons-material/Check';
import logo from 'assets/img/logo.png';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { titleToUrl, toTitleCase, urlToTitle } from 'utils/url';
import { getTopics } from '../../visualiser-src/common/helpers';
import styles from './TopNavbar.module.scss';

const TopNavbar = () => {
  const theme = useTheme();

  const [learnAnchorEl, setLearnAnchorEl] = React.useState<null | HTMLElement>(null);

  const isLearnMenuOpen = Boolean(learnAnchorEl);

  const currTopic = toTitleCase(urlToTitle(useParams().topic || ''));

  /* --------------------------- Dropdown Callbacks --------------------------- */

  const handleLearnMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLearnAnchorEl(event.currentTarget);
  };

  const handleLearnMenuClose = () => {
    setLearnAnchorEl(null);
  };

  /* ------------------------ Dropdown Menu Components ------------------------ */

  const learnMenuId = 'topnav-menu-learn';
  const renderLearnMenu = (
    <Menu
      anchorEl={learnAnchorEl}
      id={learnMenuId}
      open={isLearnMenuOpen}
      onClose={handleLearnMenuClose}
      disableScrollLock
    >
      {getTopics() &&
        getTopics().map((topic, idx) => (
          <MenuItem
            key={idx}
            className={styles.item}
            component={Link}
            to={`/visualiser/${titleToUrl(topic)}`}
            onClick={handleLearnMenuClose}
          >
            {topic.toLowerCase() === currTopic.toLowerCase() ? (
              <>
                <ListItemIcon>
                  <Check sx={{ fill: 'white' }} />
                </ListItemIcon>
                <ListItemText>{topic}</ListItemText>
              </>
            ) : (
              <ListItemText inset>{topic}</ListItemText>
            )}
          </MenuItem>
        ))}
    </Menu>
  );

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          transition: '0.5s all ease-in-out',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Toolbar>
          <Box display="flex" alignItems="center">
            <Button color="info" onClick={handleLearnMenuOpen} endIcon={<KeyboardArrowDownIcon />}>
              <Typography>
                <strong>{currTopic ? 'Topic: ' : 'Topics'}</strong>
                {currTopic}
              </Typography>
            </Button>
            <Box className={styles.centralBox}>
              <Button color="inherit" component={Link} to="/">
                <img src={logo} draggable={false} alt="logo" />
                <Typography
                  variant="h4"
                  noWrap
                  sx={{
                    fontFamily: 'CodeText',
                    textTransform: 'none',
                  }}
                >
                  Structs.sh
                </Typography>
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      {renderLearnMenu}
    </Box>
  );
};

export default TopNavbar;
