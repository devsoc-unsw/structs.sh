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

  // const [learnAnchorEl, setLearnAnchorEl] = React.useState<null | HTMLElement>(null);
  //
  // const isLearnMenuOpen = Boolean(learnAnchorEl);
  //
  const currTopic = toTitleCase(urlToTitle(useParams().topic || ''));
  //
  // /* --------------------------- Dropdown Callbacks --------------------------- */
  //
  // const handleLearnMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setLearnAnchorEl(event.currentTarget);
  // };
  //
  // const handleLearnMenuClose = () => {
  //   setLearnAnchorEl(null);
  // };
  //
  // /* ------------------------ Dropdown Menu Components ------------------------ */
  //
  // const learnMenuId = 'topnav-menu-learn';
  // const renderLearnMenu = (
  //   <Menu
  //     menuAnchorEl={learnAnchorEl}
  //     id={learnMenuId}
  //     open={isLearnMenuOpen}
  //     onClose={handleLearnMenuClose}
  //     disableScrollLock
  //   >
  //     {getTopics() &&
  //       getTopics().map((topic, idx) => (
  //         <MenuItem
  //           key={idx}
  //           className={styles.item}
  //           component={Link}
  //           to={`/visualiser/${titleToUrl(topic)}`}
  //           onClick={handleLearnMenuClose}
  //         >
  //           {topic.toLowerCase() === currTopic.toLowerCase() ? (
  //             <>
  //               <ListItemIcon>
  //                 <Check sx={{ fill: 'white' }} />
  //               </ListItemIcon>
  //               <ListItemText>{topic}</ListItemText>
  //             </>
  //           ) : (
  //             <ListItemText inset>{topic}</ListItemText>
  //           )}
  //         </MenuItem>
  //       ))}
  //   </Menu>
  // );

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(menuAnchorEl);
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
              <Menu anchorEl={menuAnchorEl} open={open} onClose={handleCloseMenu}>
                {getTopics() &&
                  getTopics().map((topic, idx) => (
                    <MenuItem
                      key={idx}
                      // className={styles.item}
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
            {/* <Grid item xs={4} display="flex" justifyContent="end"> */}
            {/*   <Button> */}
            {/*     <Typography>About</Typography> */}
            {/*   </Button> */}
            {/* </Grid> */}
          </Grid>
          {/* <Box display="flex" alignItems="center"> */}
          {/*   <Button color="info" onClick={handleLearnMenuOpen} endIcon={<KeyboardArrowDownIcon />}> */}
          {/*     <Typography> */}
          {/*       <strong>{currTopic ? 'Topic: ' : 'Topics'}</strong> */}
          {/*       {currTopic} */}
          {/*     </Typography> */}
          {/*   </Button> */}
          {/*   <Box className={styles.centralBox}> */}
          {/*     <Button color="inherit" component={Link} to="/"> */}
          {/*       <img src={logo} draggable={false} alt="logo" /> */}
          {/*       <Typography */}
          {/*         variant="h4" */}
          {/*         noWrap */}
          {/*         sx={{ */}
          {/*           fontFamily: 'CodeText', */}
          {/*           textTransform: 'none', */}
          {/*         }} */}
          {/*       > */}
          {/*         Structs.sh */}
          {/*       </Typography> */}
          {/*     </Button> */}
          {/*   </Box> */}
          {/* </Box> */}
        </Toolbar>
      </AppBar>
      {/* {renderLearnMenu} */}
    </Box>
  );
};

export default TopNavbar;
