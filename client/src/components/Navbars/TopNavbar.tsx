import { FC, MouseEvent, useState } from 'react';
import { styled } from '@mui/material/styles';
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
  ListItemIcon,
  useTheme,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import logo from 'assets/img/logo.png';
import { Link, useParams } from 'react-router-dom';
import { titleToUrl, toTitleCase, urlToTitle } from 'utils/url';
import Login from 'components/Login/Login';
import { getTopics } from '../../visualiser-src/common/helpers';
import useGlobalState from '../../store/globalStore';

const LogoText = styled(Typography)({
  textTransform: 'none',
});

const StyledCheckIcon = styled(CheckIcon)(({ theme }) => ({
  fill: theme.palette.text.primary,
}));

interface Props {
  position?: 'fixed' | 'static' | 'sticky';
}

const TopNavbar: FC<Props> = ({ position = 'fixed' }) => {
  const theme = useTheme();

  // Get current topic by the url parameter
  const currTopic = toTitleCase(urlToTitle(useParams().topic || ''));

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('user') != null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleClose = () => {
    setShowLogin(false);
  };

  const inDev = useGlobalState((state) => state.inDev);
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
                            <StyledCheckIcon />
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
                <img src={logo} alt="logo" height={50} />
                <LogoText variant="h4" fontFamily="CodeText">
                  Structs.sh
                </LogoText>
              </Button>
            </Grid>
            {inDev && (
              <Grid item xs={4} display="flex" justifyContent="end">
                {loggedIn ? (
                  <>
                    <Button style={{ color: '#0288D1' }}>{localStorage.getItem('user')}</Button>
                    <Button style={{ color: '#0288D1' }} onClick={handleLogout}>
                      Log Out
                    </Button>
                  </>
                ) : (
                  <Button style={{ color: '#0288D1' }} onClick={handleLogin}>
                    Log In
                  </Button>
                )}
                {showLogin && (
                  <Login
                    handleLogon={(status: boolean) => {
                      setLoggedIn(status);
                      setShowLogin(false);
                    }}
                    onBack={handleClose}
                  />
                )}
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopNavbar;
