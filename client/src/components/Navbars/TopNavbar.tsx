import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, FormControl, ListItemIcon, TextField, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';
import logo from 'assets/img/logo.png';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { titleToUrl, toTitleCase, urlToTitle } from 'utils/url';
import { getTopics } from '../../visualiser-src/common/helpers';
import styles from './TopNavbar.module.scss';

interface Props {
  position?: 'fixed' | 'static' | 'relative' | 'absolute';
  enableOnScrollEffect?: boolean;
}

const TopNavbar: FC<Props> = ({ position = 'fixed', enableOnScrollEffect = true }) => {
  const theme = useTheme();

  const [learnAnchorEl, setLearnAnchorEl] = React.useState<null | HTMLElement>(null);

  const isLearnMenuOpen = Boolean(learnAnchorEl);

  const currTopic = toTitleCase(urlToTitle(useParams().topic || ''));

  /* ------------------------------ Data Fetching ----------------------------- */

  // useEffect(() => {
  //   getTopics()
  //     .then((newTopics) => setTopics(newTopics))
  //     .catch(() => console.log('TopNav: failed to get topics'));
  // }, []);

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
        position={position}
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
              <Button component={Link} to="/">
                <img src={logo} draggable={false} alt="logo" />
                <Typography
                  variant="h4"
                  noWrap
                  component="div"
                  sx={{
                    fontFamily: 'CodeText',
                    textTransform: 'none',
                  }}
                  color="white"
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
