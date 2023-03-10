import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Button,
  Grid,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import useToken from './useToken';

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
    <div> 
      <Container maxWidth="sm">
        <Grid
          container
          spacing={2}
          direction="column"
          justifyContent="center"
          style={{ minHeight: "100vh" }}    
        >
        <Paper elelvation={2} sx={{ padding: 5 }}>
        <form onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              type="email"
              fullWidth
              label="Enter your username"
              placeholder="username"
              variant="outlined"
              required
              autoFocus
              onChange={(e) => setUserName(e.target?.value)}
            />
          </Grid>

          <Grid item>
            <TextField
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

          <Grid item>
            <Button type="submit" fullWidth variant="contained">
              Sign In
            </Button>
          </Grid>
        </Grid>
        </form>
        </Paper>
        </Grid>
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