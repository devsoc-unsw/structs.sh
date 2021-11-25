import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import logo from 'assets/img/logo.png';
import linkedListIcon from 'assets/img/linked-list.png';
import bstIcon from 'assets/img/bst.png';
import styles from './TopNavbar.module.scss';
import { Link } from 'react-router-dom';
import SunIcon from '@mui/icons-material/Brightness7';
import MoonIcon from '@mui/icons-material/NightsStay';
import React, { useContext, useEffect, useState } from 'react';
import { SxProps } from '@mui/system';
import { ThemeMutationContext } from 'App';
import { Modal } from 'components/Modal';

export default function TopNavbar() {
    const context = useContext(ThemeMutationContext);

    const [hasScrolledDown, setHasScrolledDown] = useState<boolean>(false);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [learnAnchorEl, setLearnAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isLearnMenuOpen = Boolean(learnAnchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    /* -------------------------- Page Scroll Callbacks ------------------------- */

    useEffect(() => {
        window.addEventListener('scroll', () => {
            const yOffsetPx: number = Number(window.pageYOffset);
            setHasScrolledDown(yOffsetPx <= 0 ? false : true);
        });
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
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
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
            <MenuItem className={styles.item}>
                <Link to="/visualiser/linked-list">
                    <IconButton size="large" aria-haspopup="true" color="inherit">
                        <img src={linkedListIcon} style={{ height: '40px', width: '100%' }} />
                    </IconButton>
                    <span>Linked List</span>
                </Link>
            </MenuItem>
            <MenuItem className={styles.item}>
                <Link to="/visualiser/bst">
                    <IconButton size="large" aria-haspopup="true" color="inherit">
                        <img src={bstIcon} style={{ height: '40px', width: '100%' }} />
                    </IconButton>
                    <span>Binary Search Tree</span>
                </Link>
            </MenuItem>
        </Menu>
    );

    /* --------------------------------- Topnav --------------------------------- */

    const hasScrolledDownStyle: SxProps = {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(7px)',
    };

    const atTopStyle: SxProps = {
        boxShadow: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(3px)',
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                sx={{
                    transition: '0.5s all ease-in-out',
                    ...(hasScrolledDown ? hasScrolledDownStyle : atTopStyle),
                }}
            >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box>
                        <Button
                            color="info"
                            onClick={handleLearnMenuOpen}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{ fontSize: '100%' }}
                        >
                            <strong>Visualiser</strong>
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Link className={styles.link} to="/content">
                            <Button color="info">Content</Button>
                        </Link>
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
                                    display: { xs: 'none', lg: 'inline-block', marginLeft: '10px' },
                                }}
                            >
                                Structs.sh
                            </Typography>
                        </Link>
                    </Box>
                    <IconButton
                        className={styles.darkModeButton}
                        onClick={() => context.toggleDarkMode()}
                    >
                        {context.isDarkMode ? <MoonIcon /> : <SunIcon />}
                    </IconButton>
                    <Modal
                        Button={() => (
                            <Button color="info" sx={{ display: { xs: 'none', md: 'flex' } }}>
                                Login
                            </Button>
                        )}
                    >
                        Login
                    </Modal>
                    <Modal
                        Button={() => (
                            <Button color="info" sx={{ display: { xs: 'none', md: 'flex' } }}>
                                Register
                            </Button>
                        )}
                    >
                        Register
                    </Modal>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
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
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderLearnMenu}
            {renderMenu}
        </Box>
    );
}
