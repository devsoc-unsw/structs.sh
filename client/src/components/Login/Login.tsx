import React, { FC, useState, useContext } from 'react';
import { Box, Typography, useTheme, Button, Input } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { Block } from '@mui/icons-material';

interface Props {
    handleLogon: any;
}

const LoginMenu = styled('div')({
    width: '30vw',
    height: '30vh',
    backgroundColor: '#46B693',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
})

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
const Login: FC<Props> = (
    {
        handleLogon
    }
) => {

    // Handle login toggle
    const [canLogin, setCanLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);

    const handleBack = () => {
        setRegister(false);
        setCanLogin(true);
        setUsername("");
        setPassword("");
    }

    // Handle login button
    const handleLogin = () => {
        axios
            .get("http://localhost:3000/api/getAllUsers")
            .then((response) => {
                let found = false;
                setCanLogin(false);
                response.data.forEach((item, index) => {
                    if (item['username'] == username && item['password'] == password) {
                        localStorage.setItem("user", username);
                        alert("Logged In as " + username);
                        found = true;
                        handleLogon(true);
                        handleBack();
                    }
                })

                if (!found) {
                    alert("Username or Password not found");
                    setUsername("");
                    setPassword("");
                }
            })
            .catch((error) => {
                // Handle the error
                console.error("Error:", error);
            });
    }

    const handleRegister = () => {
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
        setRegister(false);
    }

    // for developing purposes only, clear user database
    const handleClear = () => {
        axios
            .delete("http://localhost:3000/api/deleteAllUsers")
            .then((response) => {
                handleBack();
                handleLogon(false);
                alert("Users cleared");
            })
            .catch((error) => {
                console.error("Error deleting users:", error);
            });
    }

    return (
        <>
            {
                canLogin ?
                    <Button onClick={() => setCanLogin(false)}>Login</Button>
                    :
                    <Overlay>
                        <LoginMenu>
                            <Button onClick={() => handleBack()}>Back</Button>
                            <Input placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
                            <Input placeholder="Password" value={password} type="password" onChange={(event) => setPassword(event.target.value)} />
                            {
                                register ?
                                    <Button color="inherit" onClick={handleRegister}>Register</Button>
                                    :
                                    <>
                                        <Button color="inherit" onClick={handleLogin}>Login</Button>
                                        <a style={{ textDecoration: "underline", fontSize: "0.8em" }} onClick={() => setRegister(true)} >Create Account</a>
                                    </>
                            }
                            <Button color="inherit" onClick={handleClear}>clear database</Button>
                        </LoginMenu>
                    </Overlay>
            }
        </>
    );
};

export default Login;