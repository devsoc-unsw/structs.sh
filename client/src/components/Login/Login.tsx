import { FC, KeyboardEvent, useState } from 'react';
import { Button, Input } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { SERVER_URL } from 'utils/constants';

interface Props {
  handleLogon: any;
  onBack: any;
}

const LoginMenu = styled('div')({
  width: '30vw',
  height: '30vh',
  backgroundColor: '#46B693',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

const Overlay = styled('div')({
  position: 'fixed',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  cursor: 'pointer',
});

/**
 * Login Menu
 */
const Login: FC<Props> = ({ handleLogon, onBack }) => {
  // Handle login toggle
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [register, setRegister] = useState(false);

  const handleBack = () => {
    setRegister(false);
    setUsername('');
    setPassword('');
  };

  // Handle login button
  const handleLogin = () => {
    const data = {
      username,
      password,
    };
    axios.post(`${SERVER_URL}/auth/login`, data).then((response) => {
      if (response.data.found) {
        localStorage.setItem('user', username);

        alert(`Logged In as ${username}`);

        handleLogon(true);
        handleBack();
      } else {
        alert('Username or Password not found');
        setUsername('');
        setPassword('');
      }
    });
  };

  const handleRegister = () => {
    if (username.length === 0 || password.length === 0) {
      alert('Please enter username or password');
      return;
    }

    const data = {
      username,
      password,
    };
    axios.post(`${SERVER_URL}/auth/register`, data).then((response) => {
      if (response.data.registered) {
        handleLogin();
      } else {
        alert('Username already exists. Please Try again');
      }
    });
    setUsername('');
    setPassword('');
  };

  // for developing purposes only, clear user database
  const handleClear = () => {
    axios
      .delete(`${SERVER_URL}/api/deleteAllUsers`)
      .then(() => {
        handleBack();
        handleLogon(false);
        alert('Users cleared');
      })
      .catch((error) => {
        console.error('Error deleting users:', error);
      });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (register) {
        handleRegister();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <Overlay>
      <LoginMenu>
        <Button onClick={onBack}>Back</Button>
        <Input
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Input
          placeholder="Password"
          value={password}
          type="password"
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={handleKeyPress}
        />
        {register ? (
          <Button color="inherit" onClick={handleRegister}>
            Register
          </Button>
        ) : (
          <>
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
            <a
              role="button"
              tabIndex={0}
              style={{ textDecoration: 'underline', fontSize: '0.8em' }}
              onClick={() => setRegister(true)}
              onKeyDown={() => setRegister(true)}
            >
              Create Account
            </a>
          </>
        )}
        <Button color="inherit" onClick={handleClear}>
          clear database
        </Button>
      </LoginMenu>
    </Overlay>
  );
};

export default Login;
