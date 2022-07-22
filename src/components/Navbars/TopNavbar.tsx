import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import logo from 'assets/img/logo.png';
import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { titleToUrl } from 'utils/url';
import { getTopics } from '../../visualiser-src/common/helpers';
import styles from './TopNavbar.module.scss';

interface Props {
  position?: 'fixed' | 'static' | 'relative' | 'absolute';
  enableOnScrollEffect?: boolean;
}

const TopNavbar: FC<Props> = ({ position = 'fixed', enableOnScrollEffect = true }) => {
  const theme = useTheme();

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
          <MenuItem
            key={idx}
            className={styles.item}
            component={Link}
            to={`/visualiser/${titleToUrl(topic)}`}
            onClick={handleLearnMenuClose}
          >
            {topic}
          </MenuItem>
        ))}
    </Menu>
  );

  return (
    <Box>
      <AppBar
        position={position}
        elevation={0}
        sx={{
          transition: '0.5s all ease-in-out',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Toolbar>
          <Box display="flex" alignItems="center" width="100%">
            <Button color="info" onClick={handleLearnMenuOpen} endIcon={<KeyboardArrowDownIcon />}>
              <Typography>
                <strong>Topics</strong>
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
            <Box />
          </Box>
        </Toolbar>
      </AppBar>
      {renderLearnMenu}
    </Box>
  );
};

export default TopNavbar;
