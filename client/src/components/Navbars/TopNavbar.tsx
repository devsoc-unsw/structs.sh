import AccountCircle from '@mui/icons-material/AccountCircle';
import SunIcon from '@mui/icons-material/Brightness7';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreIcon from '@mui/icons-material/MoreVert';
import MoonIcon from '@mui/icons-material/NightsStay';
import { Button, FormControl, TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/system';
// import { ThemeMutationContext } from 'App';
import logo from 'assets/img/logo.png';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Notification from 'utils/Notification';
import { titleToUrl } from 'utils/url';
import { getTopics } from '../../visualiser-src/common/helpers';
import Drawer from './Drawer';
// import SidebarContents from './SidebarContents';
import styles from './TopNavbar.module.scss';

interface Props {
  position?: 'fixed' | 'static' | 'relative';
  enableOnScrollEffect?: boolean;
}

const TopNavbar: FC<Props> = ({ position = 'fixed', enableOnScrollEffect = true }) => {
  // const context = useContext(ThemeMutationContext);
  // const [topics, setTopics] = useState<Topic[]>([]);

  const [hasScrolledDown, setHasScrolledDown] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [learnAnchorEl, setLearnAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isLearnMenuOpen = Boolean(learnAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  /* -------------------------- Page Scroll Callbacks ------------------------- */

  const detectUserHasScrolledDown = () => {
    const yOffsetPx: number = Number(window.pageYOffset);
    setHasScrolledDown(!(yOffsetPx <= 0));
  };

  useEffect(() => {
    window.addEventListener('scroll', detectUserHasScrolledDown);
    return () => {
      window.removeEventListener('scroll', detectUserHasScrolledDown);
    };
  }, [setHasScrolledDown]);

  /* ------------------------------ Data Fetching ----------------------------- */

  // useEffect(() => {
  //   getTopics()
  //     .then((newTopics) => setTopics(newTopics))
  //     .catch(() => console.log('TopNav: failed to get topics'));
  // }, []);

  /* --------------------------- Dropdown Callbacks --------------------------- */

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLearnMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLearnAnchorEl(event.currentTarget);
  };

  const handleLearnMenuClose = () => {
    setLearnAnchorEl(null);
  };

  /* ------------------------ Dropdown Menu Components ------------------------ */

  const menuId = 'topnav-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'topnav-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="topnav-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const learnMenuId = 'topnav-menu-learn';
  const renderLearnMenu = (
    <Menu
      anchorEl={learnAnchorEl}
      id={learnMenuId}
      open={isLearnMenuOpen}
      onClose={handleLearnMenuClose}
      className={styles.visualiserMenu}
    >
      {getTopics() &&
        getTopics().map((topic, idx) => (
          <MenuItem key={idx} className={styles.item}>
            <Link to={`/visualiser/${titleToUrl(topic)}`}>
              <span>{topic}</span>
            </Link>
          </MenuItem>
        ))}
    </Menu>
  );

  /* -------------------------------- Topnav --------------------------------- */

  const hasScrolledDownStyle: SxProps = {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(7px)',
  };

  const atTopStyle: SxProps = {
    boxShadow: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(3px)',
  };

  const appliedStyle = enableOnScrollEffect
    ? hasScrolledDown
      ? hasScrolledDownStyle
      : atTopStyle
    : hasScrolledDownStyle;

  return (
    <Box sx={{ flexGrow: 1, height: '64px' }}>
      <AppBar
        position={position}
        sx={{
          transition: '0.5s all ease-in-out',
          ...appliedStyle,
        }}
      >
        <Toolbar>
          {/* <Drawer Contents={(props) => <SidebarContents {...props} />} /> */}
          <Button
            color="info"
            onClick={handleLearnMenuOpen}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ fontSize: '100%' }}
          >
            <strong>Topics</strong>
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            {/* <Link className={styles.link} to="/content">
              <Button color="info">Content</Button>
            </Link> */}
          </Box>
          <Box className={styles.centralBox}>
            <Link to="/">
              <Box sx={{ display: { xs: 'none', lg: 'inline-block' } }}>
                <img src={logo} draggable={false} alt="logo" />
              </Box>
              <Typography
                variant="h4"
                noWrap
                component="div"
                sx={{
                  display: {
                    xs: 'none',
                    lg: 'inline-block',
                    marginLeft: '10px',
                    fontFamily: 'CodeText',
                  },
                }}
              >
                Structs.sh
              </Typography>
            </Link>
          </Box>

          {/* <IconButton className={styles.darkModeButton} onClick={() => context.toggleDarkMode()}>
            {context.isDarkMode ? <MoonIcon /> : <SunIcon />}
          </IconButton> */}
          {/* <Modal
            Button={() => (
              <Button color="info" sx={{ display: { xs: 'none', md: 'flex' } }}>
                Login
              </Button>
            )}
          >
            <Typography color="textPrimary" variant="h4" sx={{ textAlign: 'center' }}>
              Login
            </Typography>
            <FormControl fullWidth>
              <TextField label="Email" sx={{ mt: 2 }} />
              <TextField label="Password" sx={{ mt: 2 }} />
            </FormControl>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <FacebookIcon />
              <GoogleIcon />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => Notification.error('Unimplemented')}
              >
                Submit
              </Button>
            </Box>
          </Modal>
          <Modal
            Button={() => (
              <Button color="info" sx={{ display: { xs: 'none', md: 'flex' } }}>
                Register
              </Button>
            )}
          >
            <Typography color="textPrimary" variant="h4" sx={{ textAlign: 'center' }}>
              Register
            </Typography>
            <FormControl fullWidth>
              <TextField label="Email" sx={{ mt: 2 }} />
              <TextField label="Username" sx={{ mt: 2 }} />
              <TextField label="Password" sx={{ mt: 2 }} />
            </FormControl>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <FacebookIcon />
              <GoogleIcon />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => Notification.error('Unimplemented')}
              >
                Submit
              </Button>
            </Box>
          </Modal> */}
          {/* <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box> */}
          {/* <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box> */}
        </Toolbar>
      </AppBar>
      {/* {renderMobileMenu} */}
      {renderLearnMenu}
      {renderMenu}
    </Box>
  );
};

export default TopNavbar;
