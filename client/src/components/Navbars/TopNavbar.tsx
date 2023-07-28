import React, { FC, useContext, useEffect, useState } from 'react';
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
  FormControl,
  ListItemIcon,
  TextField,
  useTheme,
  Input
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import logo from 'assets/img/logo.png';
import { Link, useParams } from 'react-router-dom';
import { titleToUrl, toTitleCase, urlToTitle } from 'utils/url';
import { getTopics } from '../../visualiser-src/common/helpers';
import axios from 'axios';

const LogoText = styled(Typography)({
  textTransform: 'none',
});

const StyledCheckIcon = styled(CheckIcon)(({ theme }) => ({
  fill: theme.palette.text.primary,
}));

interface Props {
  position?: 'fixed' | 'static';
}

const TopNavbar: FC<Props> = ({ position = 'fixed' }) => {
  const theme = useTheme();

  // Handle login toggle
  const [canLogin, setCanLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")

  // Handle login button
  const handleLogin = () => {
    if (username.length == 0 || password.length == 0) {
      alert("Please enter username or password");
      return;
    }
    console.log("logging on");
    const data = {
      username: username,
      password: password
    };
    axios
      .post("http://localhost:3000/api/register", data)
      .then((response) => {
        console.log("User saved", response.data);
        alert("User Saved");
      })
      .catch((error) => {
        console.error("Error registering user:", error);
      });
    setUsername("");
    setPassword("");
  }

  // for developing purposes only, clear user database
  const handleClear = () => {
    axios
      .delete("http://localhost:3000/api/deleteAllUsers")
      .then((response) => {
        alert("Users cleared");
      })
      .catch((error) => {
        console.error("Error deleting users:", error);
      });
  }

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
            {
              canLogin ?
                <>
                  <Grid item xs={4} display="flex" justifyContent="end">
                    <Input placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
                    <Input placeholder="Password" value={password} type="password" onChange={(event) => setPassword(event.target.value)} />
                    <Button color="inherit" onClick={handleLogin}>Login</Button>
                    <Button color="inherit" onClick={handleClear}>clear</Button>
                  </Grid>
                </>
                :
                <Grid item xs={4} display="flex" justifyContent="end">
                  <Button color="inherit" onClick={() => setCanLogin(true)}>Login</Button>
                </Grid>
            }
          </Grid>
        </Toolbar>
      </AppBar>
    </Box >
  );
};

export default TopNavbar;
