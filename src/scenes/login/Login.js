import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Button,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import useToken from './useToken';
import './Login.css'

async function loginUser(credentials) {
  return fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('is_super', data.is_super);
    return data;
  })
  .catch(error => {
    console.error('Error:', error);
    throw error;
  });
}


export default function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setToken } = useToken();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await loginUser({
        username,
        password
      });
      setToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('is_super', response.is_super); // Save the is_super value in local storage
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Error: Invalid Username or Password', );
    }
  }
  

  return(
  
    <div class="container">
      <Container class="screen">
        <Grid
          container
          spacing={2}
          direction="column"
          justifyContent="center"
          style={{ minHeight: "100vh" }}    
          class="screen__content">
          <form class="login" onSubmit={handleSubmit}>
            <Grid item class="login__field">
              <TextField
                class="login__input"
                type="string"
                fullWidth
                label="Enter your username"
                placeholder="username"
                variant="outlined"
                required
                autoFocus
                onChange={(e) => setUserName(e.target?.value)}
                />
            </Grid>
            <Grid item class="login__field">
              <TextField
                class="login__input"
                type={showPassword ? "text" : "password"}
                fullWidth
                label="Password"
                placeholder="Password"
                variant="outlined"
                required
                onChange={(e) => setPassword(e.target?.value)}    
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}
                        aria-label="toggle password" edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
              }}
              />
            </Grid>
            <Button type="submit" fullWidth variant="contained" class="button login__submit">
              <span class="button__text">Sign In</span>
            </Button>
          </form>
          <div class="social-login">
          </div>
        </Grid>
        <div class="screen__background">
          <span class="screen__background__shape screen__background__shape4"></span>
          <span class="screen__background__shape screen__background__shape3"></span>		
          <span class="screen__background__shape screen__background__shape2"></span>
          <span class="screen__background__shape screen__background__shape1"></span>
        </div>		
      </Container>
    </div> 
  );
}

Login.propTypes = {
  setToken: PropTypes.func,
};

Login.defaultProps = {
  setToken: () => {},
};

