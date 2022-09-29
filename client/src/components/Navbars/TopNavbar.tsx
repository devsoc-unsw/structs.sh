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

const TopNavbar = () => {
  const theme = useTheme();

  // Get current topic by the url parameter
  const currTopic = toTitleCase(urlToTitle(useParams().topic || ''));

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

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
          <Grid container alignItems="center">
            <Grid item xs={4} display="flex">
              <Button color="info" onClick={handleOpenMenu} endIcon={<KeyboardArrowDownIcon />}>
                <Typography>
                  <strong>{currTopic ? 'Topic: ' : 'Topics'}</strong> {currTopic}
                </Typography>
              </Button>
              <Menu anchorEl={menuAnchorEl} open={menuOpen} onClose={handleCloseMenu}>
                {getTopics() &&
                  getTopics().map((topic, idx) => (
                    <MenuItem
                      key={idx}
                      component={Link}
                      to={`/visualiser/${titleToUrl(topic)}`}
                      onClick={handleCloseMenu}
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
            </Grid>
            <Grid item xs={4} display="flex" justifyContent="center">
              <Button color="inherit" component={Link} to="/">
                <img src={logo} alt="logo" style={{ maxHeight: '48px' }} />
                <Typography
                  variant="h4"
                  fontFamily="CodeText"
                  sx={{ textTransform: 'none', margin: '0 1' }}
                >
                  Structs.sh
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopNavbar;
