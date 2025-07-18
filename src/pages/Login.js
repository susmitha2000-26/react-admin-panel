import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  };

  return (
    // Background color for the entire page
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f7fa', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Grid container>
            {/* Left Side: Image */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  minHeight: 400,
                  backgroundColor: '#a5e7f3ff', // bg color for image side
                }}
              >
                <img
                  src="/crm.jpg" 
                  alt="CRM"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>

            {/* Right Side: Login Form */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom>
                  CRM Login
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
                  Enter your username and password
                </Typography>

                <Box mt={3}>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
                  onClick={handleLogin}
                >
                  Login
                </Button>

                {/* CRM Website Link or branding */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 4 }}
                >
                  Visit our website:{' '}
                  <Link
                    href="https://crmwebsite.com"
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                  >
                    crmwebsite.com
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
